import { prisma } from '../database/connection.js';
import { passwordService } from './password.service.js';
import { tokenService } from './token.service.js';
import { ConflictError, InvalidCredentialsError, AccountInactiveError, AccountLockedError, NotFoundError } from '../utils/errors.js';
import { generateSecureToken, hashToken, calculateExpiration } from '../utils/crypto.js';
import { config } from '../config/index.js';
import { createLogger } from '../utils/logger.js';
import type { AuthResponse, DeviceInfo, SafeUser } from '../types/auth.types.js';

const logger = createLogger('auth-service');

/**
 * Auth Service
 * Core authentication logic
 */
export class AuthService {
    /**
     * Register a new user
     */
    async register(input: any, deviceInfo?: DeviceInfo): Promise<AuthResponse> {
        const { email, password, firstName, lastName } = input;

        // Check if email already exists
        const existing = await prisma.user.findUnique({
            where: { email },
        });

        if (existing) {
            throw new ConflictError('Email already registered');
        }

        // Hash password
        const passwordHash = await passwordService.hash(password);

        // Create user with default 'user' role
        const defaultRole = await prisma.role.findUnique({
            where: { name: 'user' },
        });

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                lastName,
                userRoles: defaultRole
                    ? {
                        create: {
                            roleId: defaultRole.id,
                        },
                    }
                    : undefined,
            },
            include: {
                userRoles: {
                    include: {
                        role: {
                            include: {
                                rolePermissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        logger.info({ userId: user.id, email }, 'User registered');

        // Extract roles and permissions
        const roles = user.userRoles.map((ur) => ur.role.name);
        const permissions = user.userRoles.flatMap((ur) =>
            ur.role.rolePermissions.map((rp) => rp.permission.name)
        );

        // Generate tokens
        const tokens = await tokenService.generateTokenPair(
            user.id,
            user.email,
            roles,
            permissions,
            deviceInfo
        );

        return {
            user: this.sanitizeUser(user, roles, permissions),
            tokens,
        };
    }

    /**
     * Login user
     */
    async login(input: any, deviceInfo?: DeviceInfo): Promise<AuthResponse> {
        const { email, password } = input;

        // Check for account lockout
        await this.checkAccountLockout(email);

        // Find user with roles
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                userRoles: {
                    include: {
                        role: {
                            include: {
                                rolePermissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            await this.recordLoginAttempt(email, deviceInfo?.ipAddress, false, 'User not found');
            throw new InvalidCredentialsError();
        }

        // Check if account is active
        if (!user.isActive) {
            await this.recordLoginAttempt(email, deviceInfo?.ipAddress, false, 'Account inactive');
            throw new AccountInactiveError();
        }

        // Verify password
        if (!user.passwordHash) {
            await this.recordLoginAttempt(email, deviceInfo?.ipAddress, false, 'Account has no password (social login)');
            throw new InvalidCredentialsError();
        }

        const isValid = await passwordService.verify(user.passwordHash as string, password);
        if (!isValid) {
            await this.recordLoginAttempt(email, deviceInfo?.ipAddress, false, 'Invalid password');
            throw new InvalidCredentialsError();
        }

        // Record successful login
        await this.recordLoginAttempt(email, deviceInfo?.ipAddress, true);

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        logger.info({ userId: user.id, email }, 'User logged in');

        // Extract roles and permissions
        const roles = user.userRoles.map((ur) => ur.role.name);
        const permissions = user.userRoles.flatMap((ur) =>
            ur.role.rolePermissions.map((rp) => rp.permission.name)
        );

        // Generate tokens
        const tokens = await tokenService.generateTokenPair(
            user.id,
            user.email,
            roles,
            [...new Set(permissions)],
            deviceInfo
        );

        return {
            user: this.sanitizeUser(user, roles, permissions),
            tokens,
        };
    }

    /**
     * Logout (revoke current refresh token)
     */
    async logout(refreshToken: string): Promise<void> {
        await tokenService.revokeToken(refreshToken);
        logger.info('User logged out');
    }

    /**
     * Logout from all devices
     */
    async logoutAll(userId: string): Promise<void> {
        await tokenService.revokeAllUserTokens(userId);
        logger.info({ userId }, 'User logged out from all devices');
    }

    /**
     * Request password reset
     */
    async forgotPassword(email: string): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Always return success to prevent email enumeration
        if (!user) {
            logger.info({ email }, 'Password reset requested for non-existent email');
            return;
        }

        // Generate reset token
        const token = generateSecureToken(32);
        const tokenHash = hashToken(token);
        const expiresAt = calculateExpiration('1h');

        // Store token
        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt,
            },
        });

        // TODO: Send email with reset link
        // In production, integrate with email service
        logger.info({ userId: user.id }, 'Password reset token generated');
    }

    /**
     * Reset password with token
     */
    async resetPassword(token: string, newPassword: string): Promise<void> {
        const tokenHash = hashToken(token);
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { tokenHash },
            include: { user: true },
        });

        if (!resetToken) {
            throw new NotFoundError('Reset token');
        }

        if (resetToken.isUsed) {
            throw new ConflictError('Reset token already used');
        }

        if (resetToken.expiresAt < new Date()) {
            throw new ConflictError('Reset token expired');
        }

        // Hash new password
        const passwordHash = await passwordService.hash(newPassword);

        // Update password and mark token as used
        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: { passwordHash },
            }),
            prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { isUsed: true },
            }),
            // Revoke all refresh tokens for security
            prisma.refreshToken.updateMany({
                where: { userId: resetToken.userId },
                data: { isRevoked: true, revokedAt: new Date() },
            }),
        ]);

        logger.info({ userId: resetToken.userId }, 'Password reset completed');
    }

    /**
     * Check if account is locked due to too many failed attempts
     */
    async checkAccountLockout(email: string): Promise<void> {
        const lockoutWindow = new Date(Date.now() - config.bruteForce.lockoutDurationMs);
        const failedAttempts = await prisma.loginAttempt.count({
            where: {
                email,
                isSuccessful: false,
                attemptedAt: {
                    gte: lockoutWindow,
                },
            },
        });

        if (failedAttempts >= config.bruteForce.maxLoginAttempts) {
            const remainingMinutes = Math.ceil(config.bruteForce.lockoutDurationMs / 60000);
            throw new AccountLockedError(remainingMinutes);
        }
    }

    /**
     * Record login attempt for brute force protection
     */
    async recordLoginAttempt(
        email: string,
        ipAddress?: string,
        isSuccessful = false,
        failureReason?: string
    ): Promise<void> {
        await prisma.loginAttempt.create({
            data: {
                email,
                ipAddress: ipAddress ?? 'unknown',
                isSuccessful,
                failureReason,
            },
        });
    }

    /**
     * Convert user to safe format (no sensitive data)
     */
    sanitizeUser(user: any, roles: string[], permissions: string[]): SafeUser {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive,
            isVerified: user.isVerified,
            emailVerifiedAt: user.emailVerifiedAt,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            roles,
            permissions: [...new Set(permissions)],
        };
    }
}

// Export singleton instance
export const authService = new AuthService();
