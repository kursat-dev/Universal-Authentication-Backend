import { Request, Response } from 'express';
/**
 * Role Controller
 * Handles role and permission management endpoints
 */
export declare const roleController: {
    /**
     * GET /roles
     * List all roles
     */
    getAll: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * GET /roles/:id
     * Get role by ID with permissions
     */
    getById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * POST /roles
     * Create a new role
     */
    create: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * PATCH /roles/:id
     * Update a role
     */
    update: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * DELETE /roles/:id
     * Delete a role
     */
    delete: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * GET /permissions
     * List all permissions
     */
    getAllPermissions: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * POST /roles/:id/permissions
     * Assign permission to role
     */
    assignPermission: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * DELETE /roles/:id/permissions/:permissionId
     * Remove permission from role
     */
    removePermission: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=role.controller.d.ts.map