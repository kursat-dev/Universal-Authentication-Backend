import { Request, Response } from 'express';
import { rbacService } from '../services/rbac.service.js';
import { ResponseHelper } from '../utils/response.js';
import { asyncHandler } from '../middleware/error.middleware.js';

/**
 * Role Controller
 * Handles role and permission management endpoints
 */
export const roleController = {
    /**
     * GET /roles
     * List all roles
     */
    getAll: asyncHandler(async (_req: Request, res: Response) => {
        const roles = await rbacService.getAllRoles();
        return ResponseHelper.success(res, { roles });
    }),

    /**
     * GET /roles/:id
     * Get role by ID with permissions
     */
    getById: asyncHandler(async (req: Request, res: Response) => {
        const role = await rbacService.getRoleById(req.params.id as string);
        return ResponseHelper.success(res, { role });
    }),

    /**
     * POST /roles
     * Create a new role
     */
    create: asyncHandler(async (req: Request, res: Response) => {
        const { name, description, permissionIds } = req.body;
        const role = await rbacService.createRole(name, description, permissionIds);
        return ResponseHelper.created(res, { role });
    }),

    /**
     * PATCH /roles/:id
     * Update a role
     */
    update: asyncHandler(async (req: Request, res: Response) => {
        const { name, description } = req.body;
        const role = await rbacService.updateRole(req.params.id as string, name, description);
        return ResponseHelper.success(res, { role });
    }),

    /**
     * DELETE /roles/:id
     * Delete a role
     */
    delete: asyncHandler(async (req: Request, res: Response) => {
        await rbacService.deleteRole(req.params.id as string);
        return ResponseHelper.noContent(res);
    }),

    /**
     * GET /permissions
     * List all permissions
     */
    getAllPermissions: asyncHandler(async (_req: Request, res: Response) => {
        const permissions = await rbacService.getAllPermissions();
        return ResponseHelper.success(res, { permissions });
    }),

    /**
     * POST /roles/:id/permissions
     * Assign permission to role
     */
    assignPermission: asyncHandler(async (req: Request, res: Response) => {
        const { permissionId } = req.body;
        await rbacService.assignPermissionToRole(req.params.id as string, permissionId);
        return ResponseHelper.success(res, { message: 'Permission assigned successfully' });
    }),

    /**
     * DELETE /roles/:id/permissions/:permissionId
     * Remove permission from role
     */
    removePermission: asyncHandler(async (req: Request, res: Response) => {
        await rbacService.removePermissionFromRole(req.params.id as string, req.params.permissionId as string);
        return ResponseHelper.noContent(res);
    }),
};
