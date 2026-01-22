/**
 * General API Rate Limiter
 * Limits requests to prevent abuse
 */
export declare const generalRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Auth Endpoints Rate Limiter
 * Stricter limits for login, register, password reset
 */
export declare const authRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Strict Rate Limiter for sensitive operations
 * e.g., password reset, email verification
 */
export declare const strictRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=rate-limit.middleware.d.ts.map