import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { prisma } from '../database/connection.js';
import {
    generateSecureToken,
    hashToken,
    calculateExpiration,
    parseDuration,
} from '../utils/crypto.js';
import { TokenExpiredError, TokenRevokedError, UnauthorizedError } from '../utils/errors.js';
import type { JwtPayload, TokenPair, DeviceInfo } from '../types/auth.types.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('token-service');

/**
 * Token Service
 * Handles JWT access tokens and refresh tokens
 */
export class TokenService {
    /**
     * Generate access and refresh token pair
     */
    async generateTokenPair(
        userId: string,
        email: string,
        roles: string[],
        permissions: string[],
        deviceInfo?: DeviceInfo
    ): Promise<TokenPair> {
        // Generate access token (short-lived)
        const accessToken = this.generateAccessToken(userId, email, roles, permissions);

        // Generate refresh token (long-lived, stored in DB)
        const refreshToken = await this.generateRefreshToken(userId, deviceInfo);

        // Calculate expiration in seconds
        const expiresIn = Math.floor(parseDuration(config.jwt.accessExpiration) / 1000);

        return {
            accessToken,
            refreshToken,
            expiresIn,
        };
    }

    /**
     * Generate JWT access token
     */
    private generateAccessToken(
        userId: string,
        email: string,
        roles: string[],
        permissions: string[]
    ): string {
        const payload: Omit<JwtPayload, 'iat' | 'exp' | 'iss'> = {
            sub: userId,
            email,
            roles,
            permissions,
        };

        // Parse duration to seconds for expiresIn
        const expiresInSeconds = Math.floor(parseDuration(config.jwt.accessExpiration) / 1000);

        return jwt.sign(payload, config.jwt.secret, {
            expiresIn: expiresInSeconds,
            issuer: config.jwt.issuer,
        });
    }

    /**
     * Generate and store refresh token
     */
    private async generateRefreshToken(userId: string, deviceInfo?: DeviceInfo): Promise<string> {
        const token = generateSecureToken(64);
        const tokenHash = hashToken(token);
        const expiresAt = calculateExpiration(config.jwt.refreshExpiration);

        await prisma.refreshToken.create({
            data: {
                userId,
                tokenHash,
                deviceInfo: deviceInfo?.userAgent,
                ipAddress: deviceInfo?.ipAddress,
                expiresAt,
            },
        });

        return token;
    }

    /**
     * Verify JWT access token
     */
    verifyAccessToken(token: string): JwtPayload {
        try {
            const payload = jwt.verify(token, config.jwt.secret, {
                issuer: config.jwt.issuer,
            }) as JwtPayload;

            return payload;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new TokenExpiredError();
            }
            throw new UnauthorizedError('Invalid token');
        }
    }

    /**
     * Verify and rotate refresh token
     * Returns new token pair and invalidates old refresh token
     */
    async refreshTokens(refreshToken: string, deviceInfo?: DeviceInfo): Promise<TokenPair> {
        const tokenHash = hashToken(refreshToken);

        // Find the token and include user with roles
        const storedToken = await prisma.refreshToken.findUnique({
            where: { tokenHash },
            include: {
                user: {
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
                },
            },
        });

        if (!storedToken) {
            logger.warn({ tokenHash: tokenHash.substring(0, 10) }, 'Refresh token not found');
            throw new UnauthorizedError('Invalid refresh token');
        }

        // Check if token is revoked
        if (storedToken.isRevoked) {
            logger.warn({ userId: storedToken.userId }, 'Attempted use of revoked refresh token');
            throw new TokenRevokedError();
        }

        // Check if token is expired
        if (storedToken.expiresAt < new Date()) {
            logger.warn({ userId: storedToken.userId }, 'Attempted use of expired refresh token');
            throw new TokenExpiredError();
        }

        // Revoke old token (token rotation)
        await prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: {
                isRevoked: true,
                revokedAt: new Date(),
            },
        });

        // Extract roles and permissions
        const roles = storedToken.user.userRoles.map((ur) => ur.role.name);
        const permissions = storedToken.user.userRoles.flatMap((ur) =>
            ur.role.rolePermissions.map((rp) => rp.permission.name)
        );

        // Generate new token pair
        return this.generateTokenPair(
            storedToken.userId,
            storedToken.user.email,
            roles,
            [...new Set(permissions)], // Deduplicate permissions
            deviceInfo
        );
    }

    /**
     * Revoke a single refresh token
     */
    async revokeToken(refreshToken: string): Promise<void> {
        const tokenHash = hashToken(refreshToken);

        await prisma.refreshToken.updateMany({
            where: { tokenHash },
            data: {
                isRevoked: true,
                revokedAt: new Date(),
            },
        });
    }

    /**
     * Revoke all refresh tokens for a user
     */
    async revokeAllUserTokens(userId: string): Promise<void> {
        await prisma.refreshToken.updateMany({
            where: {
                userId,
                isRevoked: false,
            },
            data: {
                isRevoked: true,
                revokedAt: new Date(),
            },
        });

        logger.info({ userId }, 'Revoked all refresh tokens for user');
    }

    /**
     * Clean up expired tokens (for scheduled job)
     */
    async cleanupExpiredTokens(): Promise<number> {
        const result = await prisma.refreshToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });

        logger.info({ count: result.count }, 'Cleaned up expired tokens');
        return result.count;
    }
}

// Export singleton instance
export const tokenService = new TokenService();
