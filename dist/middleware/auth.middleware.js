"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.optionalAuth = optionalAuth;
exports.isAuthenticated = isAuthenticated;
const token_service_js_1 = require("../services/token.service.js");
const user_service_js_1 = require("../services/user.service.js");
const errors_js_1 = require("../utils/errors.js");
/**
 * Extract Bearer token from Authorization header
 */
function extractBearerToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}
/**
 * Authentication Middleware
 * Verifies JWT access token and attaches user to request
 */
async function authenticate(req, _res, next) {
    try {
        const token = extractBearerToken(req);
        if (!token) {
            throw new errors_js_1.UnauthorizedError('No token provided');
        }
        // Verify token
        const payload = token_service_js_1.tokenService.verifyAccessToken(token);
        // Get fresh user data
        const user = await user_service_js_1.userService.getById(payload.sub);
        // Check if user is active
        if (!user.isActive) {
            throw new errors_js_1.UnauthorizedError('Account is inactive');
        }
        // Attach user and payload to request
        req.user = user;
        req.jwtPayload = payload;
        next();
    }
    catch (error) {
        next(error);
    }
}
/**
 * Optional Authentication Middleware
 * Attaches user if token present, but doesn't require it
 */
async function optionalAuth(req, _res, next) {
    try {
        const token = extractBearerToken(req);
        if (token) {
            const payload = token_service_js_1.tokenService.verifyAccessToken(token);
            const user = await user_service_js_1.userService.getById(payload.sub);
            if (user.isActive) {
                req.user = user;
                req.jwtPayload = payload;
            }
        }
        next();
    }
    catch {
        // Ignore errors, continue without auth
        next();
    }
}
/**
 * Type guard for authenticated requests
 */
function isAuthenticated(req) {
    return !!req.user && !!req.jwtPayload;
}
//# sourceMappingURL=auth.middleware.js.map