"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.strictRateLimiter = exports.authRateLimiter = exports.generalRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const index_js_1 = require("../config/index.js");
const errors_js_1 = require("../utils/errors.js");
/**
 * General API Rate Limiter
 * Limits requests to prevent abuse
 */
exports.generalRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: index_js_1.config.rateLimit.windowMs,
    max: index_js_1.config.rateLimit.maxRequests,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
        next(new errors_js_1.TooManyRequestsError('Too many requests, please try again later'));
    },
});
/**
 * Auth Endpoints Rate Limiter
 * Stricter limits for login, register, password reset
 */
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: index_js_1.config.rateLimit.authWindowMs,
    max: index_js_1.config.rateLimit.authMaxRequests,
    message: 'Too many authentication attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    handler: (_req, _res, next) => {
        next(new errors_js_1.TooManyRequestsError('Too many authentication attempts, please try again later'));
    },
});
/**
 * Strict Rate Limiter for sensitive operations
 * e.g., password reset, email verification
 */
exports.strictRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: 'Too many attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
        next(new errors_js_1.TooManyRequestsError('Too many attempts, please try again later'));
    },
});
//# sourceMappingURL=rate-limit.middleware.js.map