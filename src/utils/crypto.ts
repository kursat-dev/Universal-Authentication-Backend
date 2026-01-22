import crypto from 'crypto';

/**
 * Generate a cryptographically secure random token
 */
export function generateSecureToken(length = 32): string {
    return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash a token for storage (SHA-256)
 * Used for refresh tokens, password reset tokens, etc.
 */
export function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Compare a plain token with its hash
 */
export function compareTokens(plainToken: string, hashedToken: string): boolean {
    const plainHash = hashToken(plainToken);
    return crypto.timingSafeEqual(Buffer.from(plainHash), Buffer.from(hashedToken));
}

/**
 * Parse duration string to milliseconds
 * Supports: 15m, 1h, 7d, etc.
 */
export function parseDuration(duration: string): number {
    const regex = /^(\d+)(s|m|h|d|w)$/;
    const match = duration.match(regex);

    if (!match) {
        throw new Error(`Invalid duration format: ${duration}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
        s: 1000, // seconds
        m: 60 * 1000, // minutes
        h: 60 * 60 * 1000, // hours
        d: 24 * 60 * 60 * 1000, // days
        w: 7 * 24 * 60 * 60 * 1000, // weeks
    };

    return value * multipliers[unit];
}

/**
 * Calculate expiration date from duration string
 */
export function calculateExpiration(duration: string): Date {
    const ms = parseDuration(duration);
    return new Date(Date.now() + ms);
}
