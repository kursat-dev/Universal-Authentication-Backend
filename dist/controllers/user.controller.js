"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_js_1 = require("../services/user.service.js");
const response_js_1 = require("../utils/response.js");
const error_middleware_js_1 = require("../middleware/error.middleware.js");
/**
 * User Controller
 * Handles user management endpoints
 */
exports.userController = {
    /**
     * GET /users/me
     * Get current authenticated user
     */
    getMe: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        if (!req.user) {
            return response_js_1.ResponseHelper.unauthorized(res);
        }
        return response_js_1.ResponseHelper.success(res, { user: req.user });
    }),
    /**
     * PATCH /users/me
     * Update current user profile
     */
    updateMe: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        if (!req.user) {
            return response_js_1.ResponseHelper.unauthorized(res);
        }
        const user = await user_service_js_1.userService.update(req.user.id, req.body);
        return response_js_1.ResponseHelper.success(res, { user });
    }),
    /**
     * GET /users
     * List all users (admin only)
     */
    getAll: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { users, total } = await user_service_js_1.userService.getAll(page, limit);
        return response_js_1.ResponseHelper.success(res, { users }, 200, {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    }),
    /**
     * GET /users/:id
     * Get user by ID (admin or self)
     */
    getById: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        const user = await user_service_js_1.userService.getById(req.params.id);
        return response_js_1.ResponseHelper.success(res, { user });
    }),
    /**
     * POST /users
     * Create user (admin only)
     */
    create: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        const user = await user_service_js_1.userService.create(req.body);
        return response_js_1.ResponseHelper.created(res, { user });
    }),
    /**
     * PATCH /users/:id
     * Update user (admin or self)
     */
    update: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        const user = await user_service_js_1.userService.update(req.params.id, req.body);
        return response_js_1.ResponseHelper.success(res, { user });
    }),
    /**
     * DELETE /users/:id
     * Delete user (admin only)
     */
    delete: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        await user_service_js_1.userService.delete(req.params.id);
        return response_js_1.ResponseHelper.noContent(res);
    }),
    /**
     * POST /users/:id/roles
     * Assign role to user (admin only)
     */
    assignRole: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        const { roleId } = req.body;
        await user_service_js_1.userService.assignRole(req.params.id, roleId);
        return response_js_1.ResponseHelper.success(res, { message: 'Role assigned successfully' });
    }),
    /**
     * DELETE /users/:id/roles/:roleId
     * Remove role from user (admin only)
     */
    removeRole: (0, error_middleware_js_1.asyncHandler)(async (req, res) => {
        await user_service_js_1.userService.removeRole(req.params.id, req.params.roleId);
        return response_js_1.ResponseHelper.noContent(res);
    }),
};
//# sourceMappingURL=user.controller.js.map