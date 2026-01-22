"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleController = void 0;
const rbac_service_js_1 = require("../services/rbac.service.js");
const response_js_1 = require("../utils/response.js");
const error_middleware_js_1 = require("../middleware/error.middleware.js");
/**
 * Role Controller
 * Handles role and permission management endpoints
 */
exports.roleController = {
    /**
     * GET /roles
     * List all roles
     */
    getAll: (0, error_middleware_js_1.asyncHandler)(async (_req, res) => {
        const roles = await rbac_service_js_1.rbacService.getAllRoles();
        return response_js_1.ResponseHelper.success(res, { roles });
    }),
    /**
     * GET /roles/:id
     * Get role by ID with permissions
     */
    getById: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        const role = await rbac_service_js_1.rbacService.getRoleById(req.params.id);
        return response_js_1.ResponseHelper.success(res, { role });
    }),
    /**
     * POST /roles
     * Create a new role
     */
    create: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        const { name, description, permissionIds } = req.body;
        const role = await rbac_service_js_1.rbacService.createRole(name, description, permissionIds);
        return response_js_1.ResponseHelper.created(res, { role });
    }),
    /**
     * PATCH /roles/:id
     * Update a role
     */
    update: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        const { name, description } = req.body;
        const role = await rbac_service_js_1.rbacService.updateRole(req.params.id, name, description);
        return response_js_1.ResponseHelper.success(res, { role });
    }),
    /**
     * DELETE /roles/:id
     * Delete a role
     */
    delete: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        await rbac_service_js_1.rbacService.deleteRole(req.params.id);
        return response_js_1.ResponseHelper.noContent(res);
    }),
    /**
     * GET /permissions
     * List all permissions
     */
    getAllPermissions: (0, error_middleware_js_1.asyncHandler)(async (_req, res) => {
        const permissions = await rbac_service_js_1.rbacService.getAllPermissions();
        return response_js_1.ResponseHelper.success(res, { permissions });
    }),
    /**
     * POST /roles/:id/permissions
     * Assign permission to role
     */
    assignPermission: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        const { permissionId } = req.body;
        await rbac_service_js_1.rbacService.assignPermissionToRole(req.params.id, permissionId);
        return response_js_1.ResponseHelper.success(res, { message: 'Permission assigned successfully' });
    }),
    /**
     * DELETE /roles/:id/permissions/:permissionId
     * Remove permission from role
     */
    removePermission: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        await rbac_service_js_1.rbacService.removePermissionFromRole(req.params.id, req.params.permissionId);
        return response_js_1.ResponseHelper.noContent(res);
    }),
};
//# sourceMappingURL=role.controller.js.map