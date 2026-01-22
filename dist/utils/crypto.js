"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSecureToken = generateSecureToken;
exports.hashToken = hashToken;
exports.compareTokens = compareTokens;
exports.parseDuration = parseDuration;
exports.calculateExpiration = calculateExpiration;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generate a cryptographically secure random token
 */
function generateSecureToken(length = 32) {
    return crypto_1.default.randomBytes(length).toString('hex');
}
/**
 * Hash a token for storage (SHA-256)
 * Used for refresh tokens, password reset tokens, etc.
 */
function hashToken(token) {
    return crypto_1.default.createHash('sha256').update(token).digest('hex');
}
/**
 * Compare a plain token with its hash
 */
function compareTokens(plainToken, hashedToken) {
    const plainHash = hashToken(plainToken);
    return crypto_1.default.timingSafeEqual(Buffer.from(plainHash), Buffer.from(hashedToken));
}
/**
 * Parse duration string to milliseconds
 * Supports: 15m, 1h, 7d, etc.
 */
function parseDuration(duration) {
    const regex = /^(\d+)(s|m|h|d|w)$/;
    const match = duration.match(regex);
    if (!match) {
        throw new Error(`Invalid duration format: ${duration}`);
    }
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers = {
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
function calculateExpiration(duration) {
    const ms = parseDuration(duration);
    return new Date(Date.now() + ms);
}
//# sourceMappingURL=crypto.js.map