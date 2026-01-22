import { Request, Response } from 'express';
import { userService } from '../services/user.service.js';
import { ResponseHelper } from '../utils/response.js';
import { asyncHandler } from '../middleware/error.middleware.js';

/**
 * User Controller
 * Handles user management endpoints
 */
export const userController = {
    /**
     * GET /users/me
     * Get current authenticated user
     */
    getMe: asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            return ResponseHelper.unauthorized(res);
        }
        return ResponseHelper.success(res, { user: req.user });
    }),

    /**
     * PATCH /users/me
     * Update current user profile
     */
    updateMe: asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            return ResponseHelper.unauthorized(res);
        }
        const user = await userService.update(req.user.id, req.body);
        return ResponseHelper.success(res, { user });
    }),

    /**
     * GET /users
     * List all users (admin only)
     */
    getAll: asyncHandler(async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const { users, total } = await userService.getAll(page, limit);

        return ResponseHelper.success(
            res,
            { users },
            200,
            {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        );
    }),

    /**
     * GET /users/:id
     * Get user by ID (admin or self)
     */
    getById: asyncHandler(async (req: Request, res: Response) => {
        const user = await userService.getById(req.params.id as string);
        return ResponseHelper.success(res, { user });
    }),

    /**
     * POST /users
     * Create user (admin only)
     */
    create: asyncHandler(async (req: Request, res: Response) => {
        const user = await userService.create(req.body);
        return ResponseHelper.created(res, { user });
    }),

    /**
     * PATCH /users/:id
     * Update user (admin or self)
     */
    update: asyncHandler(async (req: Request, res: Response) => {
        const user = await userService.update(req.params.id as string, req.body);
        return ResponseHelper.success(res, { user });
    }),

    /**
     * DELETE /users/:id
     * Delete user (admin only)
     */
    delete: asyncHandler(async (req: Request, res: Response) => {
        await userService.delete(req.params.id as string);
        return ResponseHelper.noContent(res);
    }),

    /**
     * POST /users/:id/roles
     * Assign role to user (admin only)
     */
    assignRole: asyncHandler(async (req: Request, res: Response) => {
        const { roleId } = req.body as { roleId: string };
        await userService.assignRole(req.params.id as string, roleId);
        return ResponseHelper.success(res, { message: 'Role assigned successfully' });
    }),

    /**
     * DELETE /users/:id/roles/:roleId
     * Remove role from user (admin only)
     */
    removeRole: asyncHandler(async (req: Request, res: Response) => {
        await userService.removeRole(req.params.id as string, req.params.roleId as string);
        return ResponseHelper.noContent(res);
    }),
};
