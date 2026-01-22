import { Request, Response } from 'express';
/**
 * User Controller
 * Handles user management endpoints
 */
export declare const userController: {
    /**
     * GET /users/me
     * Get current authenticated user
     */
    getMe: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * PATCH /users/me
     * Update current user profile
     */
    updateMe: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * GET /users
     * List all users (admin only)
     */
    getAll: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * GET /users/:id
     * Get user by ID (admin or self)
     */
    getById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * POST /users
     * Create user (admin only)
     */
    create: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * PATCH /users/:id
     * Update user (admin or self)
     */
    update: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * DELETE /users/:id
     * Delete user (admin only)
     */
    delete: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * POST /users/:id/roles
     * Assign role to user (admin only)
     */
    assignRole: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * DELETE /users/:id/roles/:roleId
     * Remove role from user (admin only)
     */
    removeRole: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=user.controller.d.ts.map