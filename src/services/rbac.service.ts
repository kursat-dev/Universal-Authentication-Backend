import { prisma } from '../database/connection.js';
import { ConflictError, NotFoundError } from '../utils/errors.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('rbac-service');

/**
 * Role-Based Access Control Service
 */
export class RbacService {
    /**
     * Check if user has a specific permission
     */
    async hasPermission(userId: string, permissionName: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
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

        if (!user) return false;

        // Check if user has admin role (wildcard permission)
        const isAdmin = user.userRoles.some((ur) => ur.role.name === 'admin');
        if (isAdmin) return true;

        // Check specific permission
        return user.userRoles.some((ur) =>
            ur.role.rolePermissions.some(
                (rp) => rp.permission.name === permissionName || rp.permission.name === '*:*'
            )
        );
    }

    /**
     * Check if user has any of the specified permissions
     */
    async hasAnyPermission(userId: string, permissionNames: string[]): Promise<boolean> {
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
    async hasRole(userId: string, roleName: string): Promise<boolean> {
        const userRole = await prisma.userRole.findFirst({
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
        return prisma.role.findMany({
            orderBy: { name: 'asc' },
        });
    }

    /**
     * Get role by ID
     */
    async getRoleById(id: string) {
        const role = await prisma.role.findUnique({
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
            throw new NotFoundError('Role');
        }

        return {
            ...role,
            permissions: role.rolePermissions.map((rp) => rp.permission),
        };
    }

    /**
     * Create a new role
     */
    async createRole(name: string, description?: string, permissionIds?: string[]) {
        // Check if role exists
        const existing = await prisma.role.findUnique({
            where: { name },
        });

        if (existing) {
            throw new ConflictError('Role already exists');
        }

        const role = await prisma.role.create({
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
    async updateRole(id: string, name?: string, description?: string) {
        // Check if system role
        const existing = await prisma.role.findUnique({
            where: { id },
        });

        if (!existing) {
            throw new NotFoundError('Role');
        }

        if (existing.isSystem && name && name !== existing.name) {
            throw new ConflictError('Cannot rename system role');
        }

        const role = await prisma.role.update({
            where: { id },
            data: { name, description },
        });

        logger.info({ roleId: id }, 'Role updated');
        return role;
    }

    /**
     * Delete a role
     */
    async deleteRole(id: string) {
        const role = await prisma.role.findUnique({
            where: { id },
        });

        if (!role) {
            throw new NotFoundError('Role');
        }

        if (role.isSystem) {
            throw new ConflictError('Cannot delete system role');
        }

        await prisma.role.delete({
            where: { id },
        });

        logger.info({ roleId: id }, 'Role deleted');
    }

    /**
     * Get all permissions
     */
    async getAllPermissions() {
        return prisma.permission.findMany({
            orderBy: [{ resource: 'asc' }, { action: 'asc' }],
        });
    }

    /**
     * Assign permission to role
     */
    async assignPermissionToRole(roleId: string, permissionId: string) {
        // Check if already assigned
        const existing = await prisma.rolePermission.findUnique({
            where: {
                roleId_permissionId: { roleId, permissionId },
            },
        });

        if (existing) {
            throw new ConflictError('Permission already assigned to role');
        }

        await prisma.rolePermission.create({
            data: { roleId, permissionId },
        });

        logger.info({ roleId, permissionId }, 'Permission assigned to role');
    }

    /**
     * Remove permission from role
     */
    async removePermissionFromRole(roleId: string, permissionId: string) {
        await prisma.rolePermission.delete({
            where: {
                roleId_permissionId: { roleId, permissionId },
            },
        });

        logger.info({ roleId, permissionId }, 'Permission removed from role');
    }
}

// Export singleton instance
export const rbacService = new RbacService();
