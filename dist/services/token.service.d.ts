import type { JwtPayload, TokenPair, DeviceInfo } from '../types/auth.types.js';
/**
 * Token Service
 * Handles JWT access tokens and refresh tokens
 */
export declare class TokenService {
    /**
     * Generate access and refresh token pair
     */
    generateTokenPair(userId: string, email: string, roles: string[], permissions: string[], deviceInfo?: DeviceInfo): Promise<TokenPair>;
    /**
     * Generate JWT access token
     */
    private generateAccessToken;
    /**
     * Generate and store refresh token
     */
    private generateRefreshToken;
    /**
     * Verify JWT access token
     */
    verifyAccessToken(token: string): JwtPayload;
    /**
     * Verify and rotate refresh token
     * Returns new token pair and invalidates old refresh token
     */
    refreshTokens(refreshToken: string, deviceInfo?: DeviceInfo): Promise<TokenPair>;
    /**
     * Revoke a single refresh token
     */
    revokeToken(refreshToken: string): Promise<void>;
    /**
     * Revoke all refresh tokens for a user
     */
    revokeAllUserTokens(userId: string): Promise<void>;
    /**
     * Clean up expired tokens (for scheduled job)
     */
    cleanupExpiredTokens(): Promise<number>;
}
export declare const tokenService: TokenService;
//# sourceMappingURL=token.service.d.ts.map