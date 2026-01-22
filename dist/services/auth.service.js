"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const connection_js_1 = require("../database/connection.js");
const password_service_js_1 = require("./password.service.js");
const token_service_js_1 = require("./token.service.js");
const errors_js_1 = require("../utils/errors.js");
const crypto_js_1 = require("../utils/crypto.js");
const index_js_1 = require("../config/index.js");
const logger_js_1 = require("../utils/logger.js");
const logger = (0, logger_js_1.createLogger)('auth-service');
/**
 * Auth Service
 * Core authentication logic
 */
class AuthService {
    /**
     * Register a new user
     */
    async register(input, deviceInfo) {
        const { email, password, firstName, lastName } = input;
        // Check if email already exists
        const existing = await connection_js_1.prisma.user.findUnique({
            where: { email },
        });
        if (existing) {
            throw new errors_js_1.ConflictError('Email already registered');
        }
        // Hash password
        const passwordHash = await password_service_js_1.passwordService.hash(password);
        // Create user with default 'user' role
        const defaultRole = await connection_js_1.prisma.role.findUnique({
            where: { name: 'user' },
        });
        const user = await connection_js_1.prisma.user.create({
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
        const permissions = user.userRoles.flatMap((ur) => ur.role.rolePermissions.map((rp) => rp.permission.name));
        // Generate tokens
        const tokens = await token_service_js_1.tokenService.generateTokenPair(user.id, user.email, roles, permissions, deviceInfo);
        return {
            user: this.sanitizeUser(user, roles, permissions),
            tokens,
        };
    }
    /**
     * Login user
     */
    async login(input, deviceInfo) {
        const { email, password } = input;
        // Check for account lockout
        await this.checkAccountLockout(email);
        // Find user with roles
        const user = await connection_js_1.prisma.user.findUnique({
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
            throw new errors_js_1.InvalidCredentialsError();
        }
        // Check if account is active
        if (!user.isActive) {
            await this.recordLoginAttempt(email, deviceInfo?.ipAddress, false, 'Account inactive');
            throw new errors_js_1.AccountInactiveError();
        }
        // Verify password
        const isValid = await password_service_js_1.passwordService.verify(user.passwordHash, password);
        if (!isValid) {
            await this.recordLoginAttempt(email, deviceInfo?.ipAddress, false, 'Invalid password');
            throw new errors_js_1.InvalidCredentialsError();
        }
        // Record successful login
        await this.recordLoginAttempt(email, deviceInfo?.ipAddress, true);
        // Update last login
        await connection_js_1.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        logger.info({ userId: user.id, email }, 'User logged in');
        // Extract roles and permissions
        const roles = user.userRoles.map((ur) => ur.role.name);
        const permissions = user.userRoles.flatMap((ur) => ur.role.rolePermissions.map((rp) => rp.permission.name));
        // Generate tokens
        const tokens = await token_service_js_1.tokenService.generateTokenPair(user.id, user.email, roles, [...new Set(permissions)], deviceInfo);
        return {
            user: this.sanitizeUser(user, roles, permissions),
            tokens,
        };
    }
    /**
     * Logout (revoke current refresh token)
     */
    async logout(refreshToken) {
        await token_service_js_1.tokenService.revokeToken(refreshToken);
        logger.info('User logged out');
    }
    /**
     * Logout from all devices
     */
    async logoutAll(userId) {
        await token_service_js_1.tokenService.revokeAllUserTokens(userId);
        logger.info({ userId }, 'User logged out from all devices');
    }
    /**
     * Request password reset
     */
    async forgotPassword(email) {
        const user = await connection_js_1.prisma.user.findUnique({
            where: { email },
        });
        // Always return success to prevent email enumeration
        if (!user) {
            logger.info({ email }, 'Password reset requested for non-existent email');
            return;
        }
        // Generate reset token
        const token = (0, crypto_js_1.generateSecureToken)(32);
        const tokenHash = (0, crypto_js_1.hashToken)(token);
        const expiresAt = (0, crypto_js_1.calculateExpiration)('1h');
        // Store token
        await connection_js_1.prisma.passwordResetToken.create({
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
    async resetPassword(token, newPassword) {
        const tokenHash = (0, crypto_js_1.hashToken)(token);
        const resetToken = await connection_js_1.prisma.passwordResetToken.findUnique({
            where: { tokenHash },
            include: { user: true },
        });
        if (!resetToken) {
            throw new errors_js_1.NotFoundError('Reset token');
        }
        if (resetToken.isUsed) {
            throw new errors_js_1.ConflictError('Reset token already used');
        }
        if (resetToken.expiresAt < new Date()) {
            throw new errors_js_1.ConflictError('Reset token expired');
        }
        // Hash new password
        const passwordHash = await password_service_js_1.passwordService.hash(newPassword);
        // Update password and mark token as used
        await connection_js_1.prisma.$transaction([
            connection_js_1.prisma.user.update({
                where: { id: resetToken.userId },
                data: { passwordHash },
            }),
            connection_js_1.prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { isUsed: true },
            }),
            // Revoke all refresh tokens for security
            connection_js_1.prisma.refreshToken.updateMany({
                where: { userId: resetToken.userId },
                data: { isRevoked: true, revokedAt: new Date() },
            }),
        ]);
        logger.info({ userId: resetToken.userId }, 'Password reset completed');
    }
    /**
     * Check if account is locked due to too many failed attempts
     */
    async checkAccountLockout(email) {
        const lockoutWindow = new Date(Date.now() - index_js_1.config.bruteForce.lockoutDurationMs);
        const failedAttempts = await connection_js_1.prisma.loginAttempt.count({
            where: {
                email,
                isSuccessful: false,
                attemptedAt: {
                    gte: lockoutWindow,
                },
            },
        });
        if (failedAttempts >= index_js_1.config.bruteForce.maxLoginAttempts) {
            const remainingMinutes = Math.ceil(index_js_1.config.bruteForce.lockoutDurationMs / 60000);
            throw new errors_js_1.AccountLockedError(remainingMinutes);
        }
    }
    /**
     * Record login attempt for brute force protection
     */
    async recordLoginAttempt(email, ipAddress, isSuccessful = false, failureReason) {
        await connection_js_1.prisma.loginAttempt.create({
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
    sanitizeUser(user, roles, permissions) {
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
exports.AuthService = AuthService;
// Export singleton instance
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map