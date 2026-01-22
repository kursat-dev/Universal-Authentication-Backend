import { Request, Response } from 'express';
/**
 * Auth Controller
 * Handles authentication endpoints
 */
export declare const authController: {
    /**
     * POST /auth/register
     * Register a new user
     */
    register: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * POST /auth/login
     * Login with email and password
     */
    login: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * POST /auth/refresh
     * Refresh access token using refresh token
     */
    refresh: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * POST /auth/logout
     * Logout current session (revoke refresh token)
     */
    logout: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * POST /auth/logout-all
     * Logout from all devices
     */
    logoutAll: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * POST /auth/forgot-password
     * Request password reset email
     */
    forgotPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * POST /auth/reset-password
     * Reset password with token
     */
    resetPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=auth.controller.d.ts.map