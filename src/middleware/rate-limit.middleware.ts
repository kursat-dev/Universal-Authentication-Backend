import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';
import { TooManyRequestsError } from '../utils/errors.js';

/**
 * General API Rate Limiter
 * Limits requests to prevent abuse
 */
export const generalRateLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
        next(new TooManyRequestsError('Too many requests, please try again later'));
    },
});

/**
 * Auth Endpoints Rate Limiter
 * Stricter limits for login, register, password reset
 */
export const authRateLimiter = rateLimit({
    windowMs: config.rateLimit.authWindowMs,
    max: config.rateLimit.authMaxRequests,
    message: 'Too many authentication attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    handler: (_req, _res, next) => {
        next(new TooManyRequestsError('Too many authentication attempts, please try again later'));
    },
});

/**
 * Strict Rate Limiter for sensitive operations
 * e.g., password reset, email verification
 */
export const strictRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: 'Too many attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
        next(new TooManyRequestsError('Too many attempts, please try again later'));
    },
});
