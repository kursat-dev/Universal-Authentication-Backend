/**
 * Generate a cryptographically secure random token
 */
export declare function generateSecureToken(length?: number): string;
/**
 * Hash a token for storage (SHA-256)
 * Used for refresh tokens, password reset tokens, etc.
 */
export declare function hashToken(token: string): string;
/**
 * Compare a plain token with its hash
 */
export declare function compareTokens(plainToken: string, hashedToken: string): boolean;
/**
 * Parse duration string to milliseconds
 * Supports: 15m, 1h, 7d, etc.
 */
export declare function parseDuration(duration: string): number;
/**
 * Calculate expiration date from duration string
 */
export declare function calculateExpiration(duration: string): Date;
//# sourceMappingURL=crypto.d.ts.map