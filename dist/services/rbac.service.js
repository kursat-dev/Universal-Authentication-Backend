"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rbacService = exports.RbacService = void 0;
const connection_js_1 = require("../database/connection.js");
const errors_js_1 = require("../utils/errors.js");
const logger_js_1 = require("../utils/logger.js");
const logger = (0, logger_js_1.createLogger)('rbac-service');
/**
 * Role-Based Access Control Service
 */
class RbacService {
    /**
     * Check if user has a specific permission
     */
    async hasPermission(userId, permissionName) {
        const user = await connection_js_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                userRoles: {
                    include: {
                        role: {
                            include: {
                                rolePermissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!user)
            return false;
        // Check if user has admin role (wildcard permission)
        const isAdmin = user.userRoles.some((ur) => ur.role.name === 'admin');
        if (isAdmin)
            return true;
        // Check specific permission
        return user.userRoles.some((ur) => ur.role.rolePermissions.some((rp) => rp.permission.name === permissionName || rp.permission.name === '*:*'));
    }
    /**
     * Check if user has any of the specified permissions
     */
    async hasAnyPermission(userId, permissionNames) {
        for (const permission of permissionNames) {
            if (await this.hasPermission(userId, permission)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Check if user has a specific role
     */
    async hasRole(userId, roleName) {
        const userRole = await connection_js_1.prisma.userRole.findFirst({
            where: {
                userId,
                role: { name: roleName },
            },
        });
        return !!userRole;
    }
    /**
     * Get all roles
     */
    async getAllRoles() {
        return connection_js_1.prisma.role.findMany({
            orderBy: { name: 'asc' },
        });
    }
    /**
     * Get role by ID
     */
    async getRoleById(id) {
        const role = await connection_js_1.prisma.role.findUnique({
            where: { id },
            include: {
                rolePermissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
        if (!role) {
            throw new errors_js_1.NotFoundError('Role');
        }
        return {
            ...role,
            permissions: role.rolePermissions.map((rp) => rp.permission),
        };
    }
    /**
     * Create a new role
     */
    async createRole(name, description, permissionIds) {
        // Check if role exists
        const existing = await connection_js_1.prisma.role.findUnique({
            where: { name },
        });
        if (existing) {
            throw new errors_js_1.ConflictError('Role already exists');
        }
        const role = await connection_js_1.prisma.role.create({
            data: {
                name,
                description,
                rolePermissions: permissionIds
                    ? {
                        create: permissionIds.map((permissionId) => ({ permissionId })),
                    }
                    : undefined,
            },
        });
        logger.info({ roleId: role.id, name }, 'Role created');
        return role;
    }
    /**
     * Update a role
     */
    async updateRole(id, name, description) {
        // Check if system role
        const existing = await connection_js_1.prisma.role.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new errors_js_1.NotFoundError('Role');
        }
        if (existing.isSystem && name && name !== existing.name) {
            throw new errors_js_1.ConflictError('Cannot rename system role');
        }
        const role = await connection_js_1.prisma.role.update({
            where: { id },
            data: { name, description },
        });
        logger.info({ roleId: id }, 'Role updated');
        return role;
    }
    /**
     * Delete a role
     */
    async deleteRole(id) {
        const role = await connection_js_1.prisma.role.findUnique({
            where: { id },
        });
        if (!role) {
            throw new errors_js_1.NotFoundError('Role');
        }
        if (role.isSystem) {
            throw new errors_js_1.ConflictError('Cannot delete system role');
        }
        await connection_js_1.prisma.role.delete({
            where: { id },
        });
        logger.info({ roleId: id }, 'Role deleted');
    }
    /**
     * Get all permissions
     */
    async getAllPermissions() {
        return connection_js_1.prisma.permission.findMany({
            orderBy: [{ resource: 'asc' }, { action: 'asc' }],
        });
    }
    /**
     * Assign permission to role
     */
    async assignPermissionToRole(roleId, permissionId) {
        // Check if already assigned
        const existing = await connection_js_1.prisma.rolePermission.findUnique({
            where: {
                roleId_permissionId: { roleId, permissionId },
            },
        });
        if (existing) {
            throw new errors_js_1.ConflictError('Permission already assigned to role');
        }
        await connection_js_1.prisma.rolePermission.create({
            data: { roleId, permissionId },
        });
        logger.info({ roleId, permissionId }, 'Permission assigned to role');
    }
    /**
     * Remove permission from role
     */
    async removePermissionFromRole(roleId, permissionId) {
        await connection_js_1.prisma.rolePermission.delete({
            where: {
                roleId_permissionId: { roleId, permissionId },
            },
        });
        logger.info({ roleId, permissionId }, 'Permission removed from role');
    }
}
exports.RbacService = RbacService;
// Export singleton instance
exports.rbacService = new RbacService();
//# sourceMappingURL=rbac.service.js.map