"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_js_1 = require("../services/auth.service.js");
const token_service_js_1 = require("../services/token.service.js");
const response_js_1 = require("../utils/response.js");
const error_middleware_js_1 = require("../middleware/error.middleware.js");
/**
 * Get device info from request
 */
function getDeviceInfo(req) {
    return {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip ?? req.socket.remoteAddress,
    };
}
/**
 * Auth Controller
 * Handles authentication endpoints
 */
exports.authController = {
    /**
     * POST /auth/register
     * Register a new user
     */
    register: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        const result = await auth_service_js_1.authService.register(req.body, getDeviceInfo(req));
        return response_js_1.ResponseHelper.created(res, result);
    }),
    /**
     * POST /auth/login
     * Login with email and password
     */
    login: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        const result = await auth_service_js_1.authService.login(req.body, getDeviceInfo(req));
        return response_js_1.ResponseHelper.success(res, result);
    }),
    /**
     * POST /auth/refresh
     * Refresh access token using refresh token
     */
    refresh: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        const { refreshToken } = req.body;
        const tokens = await token_service_js_1.tokenService.refreshTokens(refreshToken, getDeviceInfo(req));
        return response_js_1.ResponseHelper.success(res, { tokens });
    }),
    /**
     * POST /auth/logout
     * Logout current session (revoke refresh token)
     */
    logout: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        const { refreshToken } = req.body;
        await auth_service_js_1.authService.logout(refreshToken);
        return response_js_1.ResponseHelper.success(res, { message: 'Logged out successfully' });
    }),
    /**
     * POST /auth/logout-all
     * Logout from all devices
     */
    logoutAll: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        if (!req.user) {
            return response_js_1.ResponseHelper.unauthorized(res);
        }
        await auth_service_js_1.authService.logoutAll(req.user.id);
        return response_js_1.ResponseHelper.success(res, { message: 'Logged out from all devices' });
    }),
    /**
     * POST /auth/forgot-password
     * Request password reset email
     */
    forgotPassword: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        const { email } = req.body;
        await auth_service_js_1.authService.forgotPassword(email);
        // Always return success to prevent email enumeration
        return response_js_1.ResponseHelper.success(res, {
            message: 'If an account exists, a reset email has been sent',
        });
    }),
    /**
     * POST /auth/reset-password
     * Reset password with token
     */
    resetPassword: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        const { token, password } = req.body;
        await auth_service_js_1.authService.resetPassword(token, password);
        return response_js_1.ResponseHelper.success(res, { message: 'Password reset successfully' });
    }),
};
//# sourceMappingURL=auth.controller.js.map