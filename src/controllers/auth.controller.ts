import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { tokenService } from '../services/token.service.js';
import { ResponseHelper } from '../utils/response.js';
import { asyncHandler } from '../middleware/error.middleware.js';

/**
 * Get device info from request
 */
function getDeviceInfo(req: Request) {
    return {
        userAgent: req.headers['user-agent'],
        ipAddress: (req.ip || req.socket.remoteAddress) as string,
    };
}

/**
 * Auth Controller
 * Handles authentication endpoints
 */
export const authController = {
    /**
     * POST /auth/register
     * Register a new user
     */
    register: asyncHandler(async (req: Request, res: Response) => {
        const result = await authService.register(req.body, getDeviceInfo(req));
        return ResponseHelper.created(res, result);
    }),

    /**
     * POST /auth/login
     * Login with email and password
     */
    login: asyncHandler(async (req: Request, res: Response) => {
        const result = await authService.login(req.body, getDeviceInfo(req));
        return ResponseHelper.success(res, result);
    }),

    /**
     * POST /auth/refresh
     * Refresh access token using refresh token
     */
    refresh: asyncHandler(async (req: Request, res: Response) => {
        const { refreshToken } = req.body;
        const tokens = await tokenService.refreshTokens(refreshToken, getDeviceInfo(req));
        return ResponseHelper.success(res, { tokens });
    }),

    /**
     * POST /auth/logout
     * Logout current session (revoke refresh token)
     */
    logout: asyncHandler(async (req: Request, res: Response) => {
        const { refreshToken } = req.body;
        await authService.logout(refreshToken);
        return ResponseHelper.success(res, { message: 'Logged out successfully' });
    }),

    /**
     * POST /auth/logout-all
     * Logout from all devices
     */
    logoutAll: asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            return ResponseHelper.unauthorized(res);
        }
        await authService.logoutAll(req.user.id);
        return ResponseHelper.success(res, { message: 'Logged out from all devices' });
    }),

    /**
     * POST /auth/forgot-password
     * Request password reset email
     */
    forgotPassword: asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;
        await authService.forgotPassword(email);
        // Always return success to prevent email enumeration
        return ResponseHelper.success(res, {
            message: 'If an account exists, a reset email has been sent',
        });
    }),

    /**
     * POST /auth/reset-password
     * Reset password with token
     */
    resetPassword: asyncHandler(async (req: Request, res: Response) => {
        const { token, password } = req.body;
        await authService.resetPassword(token, password);
        return ResponseHelper.success(res, { message: 'Password reset successfully' });
    }),
};
