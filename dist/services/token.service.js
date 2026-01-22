"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_js_1 = require("../config/index.js");
const connection_js_1 = require("../database/connection.js");
const crypto_js_1 = require("../utils/crypto.js");
const errors_js_1 = require("../utils/errors.js");
const logger_js_1 = require("../utils/logger.js");
const logger = (0, logger_js_1.createLogger)('token-service');
/**
 * Token Service
 * Handles JWT access tokens and refresh tokens
 */
class TokenService {
    /**
     * Generate access and refresh token pair
     */
    async generateTokenPair(userId, email, roles, permissions, deviceInfo) {
        // Generate access token (short-lived)
        const accessToken = this.generateAccessToken(userId, email, roles, permissions);
        // Generate refresh token (long-lived, stored in DB)
        const refreshToken = await this.generateRefreshToken(userId, deviceInfo);
        // Calculate expiration in seconds
        const expiresIn = Math.floor((0, crypto_js_1.parseDuration)(index_js_1.config.jwt.accessExpiration) / 1000);
        return {
            accessToken,
            refreshToken,
            expiresIn,
        };
    }
    /**
     * Generate JWT access token
     */
    generateAccessToken(userId, email, roles, permissions) {
        const payload = {
            sub: userId,
            email,
            roles,
            permissions,
        };
        // Parse duration to seconds for expiresIn
        const expiresInSeconds = Math.floor((0, crypto_js_1.parseDuration)(index_js_1.config.jwt.accessExpiration) / 1000);
        return jsonwebtoken_1.default.sign(payload, index_js_1.config.jwt.secret, {
            expiresIn: expiresInSeconds,
            issuer: index_js_1.config.jwt.issuer,
        });
    }
    /**
     * Generate and store refresh token
     */
    async generateRefreshToken(userId, deviceInfo) {
        const token = (0, crypto_js_1.generateSecureToken)(64);
        const tokenHash = (0, crypto_js_1.hashToken)(token);
        const expiresAt = (0, crypto_js_1.calculateExpiration)(index_js_1.config.jwt.refreshExpiration);
        await connection_js_1.prisma.refreshToken.create({
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
    verifyAccessToken(token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, index_js_1.config.jwt.secret, {
                issuer: index_js_1.config.jwt.issuer,
            });
            return payload;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new errors_js_1.TokenExpiredError();
            }
            throw new errors_js_1.UnauthorizedError('Invalid token');
        }
    }
    /**
     * Verify and rotate refresh token
     * Returns new token pair and invalidates old refresh token
     */
    async refreshTokens(refreshToken, deviceInfo) {
        const tokenHash = (0, crypto_js_1.hashToken)(refreshToken);
        // Find the token and include user with roles
        const storedToken = await connection_js_1.prisma.refreshToken.findUnique({
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
            throw new errors_js_1.UnauthorizedError('Invalid refresh token');
        }
        // Check if token is revoked
        if (storedToken.isRevoked) {
            logger.warn({ userId: storedToken.userId }, 'Attempted use of revoked refresh token');
            throw new errors_js_1.TokenRevokedError();
        }
        // Check if token is expired
        if (storedToken.expiresAt < new Date()) {
            logger.warn({ userId: storedToken.userId }, 'Attempted use of expired refresh token');
            throw new errors_js_1.TokenExpiredError();
        }
        // Revoke old token (token rotation)
        await connection_js_1.prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: {
                isRevoked: true,
                revokedAt: new Date(),
            },
        });
        // Extract roles and permissions
        const roles = storedToken.user.userRoles.map((ur) => ur.role.name);
        const permissions = storedToken.user.userRoles.flatMap((ur) => ur.role.rolePermissions.map((rp) => rp.permission.name));
        // Generate new token pair
        return this.generateTokenPair(storedToken.userId, storedToken.user.email, roles, [...new Set(permissions)], // Deduplicate permissions
        deviceInfo);
    }
    /**
     * Revoke a single refresh token
     */
    async revokeToken(refreshToken) {
        const tokenHash = (0, crypto_js_1.hashToken)(refreshToken);
        await connection_js_1.prisma.refreshToken.updateMany({
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
    async revokeAllUserTokens(userId) {
        await connection_js_1.prisma.refreshToken.updateMany({
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
    async cleanupExpiredTokens() {
        const result = await connection_js_1.prisma.refreshToken.deleteMany({
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
exports.TokenService = TokenService;
// Export singleton instance
exports.tokenService = new TokenService();
//# sourceMappingURL=token.service.js.map