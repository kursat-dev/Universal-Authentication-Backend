"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = requirePermission;
exports.requireRole = requireRole;
exports.checkPermission = checkPermission;
exports.requireSelfOrAdmin = requireSelfOrAdmin;
const rbac_service_js_1 = require("../services/rbac.service.js");
const errors_js_1 = require("../utils/errors.js");
/**
 * Permission Guard Middleware Factory
 * Checks if user has required permission(s)
 *
 * @param permissions - Single permission or array (any match)
 */
function requirePermission(...permissions) {
    return async (req, _res, next) => {
        try {
            if (!req.user) {
                throw new errors_js_1.UnauthorizedError('Authentication required');
            }
            // Check if user has admin role (bypass permission check)
            if (req.user.roles.includes('admin')) {
                return next();
            }
            // Check if user has any of the required permissions
            const hasPermission = permissions.some((p) => req.user.permissions.includes(p));
            if (!hasPermission) {
                throw new errors_js_1.ForbiddenError(`Required permission: ${permissions.join(' or ')}`);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
/**
 * Role Guard Middleware Factory
 * Checks if user has required role(s)
 *
 * @param roles - Single role or array (any match)
 */
function requireRole(...roles) {
    return async (req, _res, next) => {
        try {
            if (!req.user) {
                throw new errors_js_1.UnauthorizedError('Authentication required');
            }
            // Check if user has any of the required roles
            const hasRole = roles.some((r) => req.user.roles.includes(r));
            if (!hasRole) {
                throw new errors_js_1.ForbiddenError(`Required role: ${roles.join(' or ')}`);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
/**
 * Dynamic Permission Check
 * For runtime permission checks (not middleware)
 */
async function checkPermission(userId, permission) {
    return rbac_service_js_1.rbacService.hasPermission(userId, permission);
}
/**
 * Self or Admin Guard
 * Allows access if user is accessing their own resource or is admin
 */
function requireSelfOrAdmin(userIdParam = 'id') {
    return (req, _res, next) => {
        try {
            if (!req.user) {
                throw new errors_js_1.UnauthorizedError('Authentication required');
            }
            const targetId = req.params[userIdParam];
            const isAdmin = req.user.roles.includes('admin');
            const isSelf = req.user.id === targetId;
            if (!isAdmin && !isSelf) {
                throw new errors_js_1.ForbiddenError('Access denied');
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=rbac.middleware.js.map