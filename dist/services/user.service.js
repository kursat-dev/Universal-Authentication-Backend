"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const connection_js_1 = require("../database/connection.js");
const password_service_js_1 = require("./password.service.js");
const errors_js_1 = require("../utils/errors.js");
const logger_js_1 = require("../utils/logger.js");
const logger = (0, logger_js_1.createLogger)('user-service');
/**
 * User Service
 * User management operations
 */
class UserService {
    /**
     * Get user by ID
     */
    async getById(id) {
        const user = await connection_js_1.prisma.user.findUnique({
            where: { id },
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
        if (!user) {
            throw new errors_js_1.NotFoundError('User');
        }
        const roles = user.userRoles.map((ur) => ur.role.name);
        const permissions = user.userRoles.flatMap((ur) => ur.role.rolePermissions.map((rp) => rp.permission.name));
        return this.sanitizeUser(user, roles, permissions);
    }
    /**
     * Get all users with pagination
     */
    async getAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            connection_js_1.prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
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
            }),
            connection_js_1.prisma.user.count(),
        ]);
        return {
            users: users.map((user) => {
                const roles = user.userRoles.map((ur) => ur.role.name);
                const permissions = user.userRoles.flatMap((ur) => ur.role.rolePermissions.map((rp) => rp.permission.name));
                return this.sanitizeUser(user, roles, permissions);
            }),
            total,
        };
    }
    /**
     * Create user (admin function)
     */
    async create(input) {
        const { email, password, firstName, lastName, roleIds, isActive, isVerified } = input;
        // Check if email exists
        const existing = await connection_js_1.prisma.user.findUnique({
            where: { email },
        });
        if (existing) {
            throw new errors_js_1.ConflictError('Email already registered');
        }
        // Hash password
        const passwordHash = await password_service_js_1.passwordService.hash(password);
        // Create user
        const user = await connection_js_1.prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                lastName,
                isActive: isActive ?? true,
                isVerified: isVerified ?? false,
                userRoles: roleIds
                    ? {
                        create: roleIds.map((roleId) => ({ roleId })),
                    }
                    : undefined,
            },
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
        logger.info({ userId: user.id }, 'User created by admin');
        const roles = user.userRoles.map((ur) => ur.role.name);
        const permissions = user.userRoles.flatMap((ur) => ur.role.rolePermissions.map((rp) => rp.permission.name));
        return this.sanitizeUser(user, roles, permissions);
    }
    /**
     * Update user
     */
    async update(id, input) {
        const user = await connection_js_1.prisma.user.update({
            where: { id },
            data: input,
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
        logger.info({ userId: id }, 'User updated');
        const roles = user.userRoles.map((ur) => ur.role.name);
        const permissions = user.userRoles.flatMap((ur) => ur.role.rolePermissions.map((rp) => rp.permission.name));
        return this.sanitizeUser(user, roles, permissions);
    }
    /**
     * Delete user
     */
    async delete(id) {
        await connection_js_1.prisma.user.delete({
            where: { id },
        });
        logger.info({ userId: id }, 'User deleted');
    }
    /**
     * Assign role to user
     */
    async assignRole(userId, roleId) {
        // Check if already assigned
        const existing = await connection_js_1.prisma.userRole.findUnique({
            where: {
                userId_roleId: { userId, roleId },
            },
        });
        if (existing) {
            throw new errors_js_1.ConflictError('Role already assigned to user');
        }
        await connection_js_1.prisma.userRole.create({
            data: { userId, roleId },
        });
        logger.info({ userId, roleId }, 'Role assigned to user');
    }
    /**
     * Remove role from user
     */
    async removeRole(userId, roleId) {
        await connection_js_1.prisma.userRole.delete({
            where: {
                userId_roleId: { userId, roleId },
            },
        });
        logger.info({ userId, roleId }, 'Role removed from user');
    }
    /**
     * Sanitize user for response
     */
    sanitizeUser(user, roles, permissions) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive,
            isVerified: user.isVerified,
            emailVerifiedAt: user.emailVerifiedAt,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            roles,
            permissions: [...new Set(permissions)],
        };
    }
}
exports.UserService = UserService;
// Export singleton instance
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map