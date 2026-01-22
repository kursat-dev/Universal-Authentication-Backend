import { prisma } from '../database/connection.js';
import { passwordService } from './password.service.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { createLogger } from '../utils/logger.js';
import type { SafeUser } from '../types/auth.types.js';
import type { CreateUserInput, UpdateUserInput } from '../schemas/user.schema.js';

const logger = createLogger('user-service');

/**
 * User Service
 * User management operations
 */
export class UserService {
    /**
     * Get user by ID
     */
    async getById(id: string): Promise<SafeUser> {
        const user = await prisma.user.findUnique({
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
            throw new NotFoundError('User');
        }

        const roles = user.userRoles.map((ur) => ur.role.name);
        const permissions = user.userRoles.flatMap((ur) =>
            ur.role.rolePermissions.map((rp) => rp.permission.name)
        );

        return this.sanitizeUser(user, roles, permissions);
    }

    /**
     * Get all users with pagination
     */
    async getAll(page = 1, limit = 10): Promise<{ users: SafeUser[]; total: number }> {
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
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
            prisma.user.count(),
        ]);

        return {
            users: users.map((user) => {
                const roles = user.userRoles.map((ur) => ur.role.name);
                const permissions = user.userRoles.flatMap((ur) =>
                    ur.role.rolePermissions.map((rp) => rp.permission.name)
                );
                return this.sanitizeUser(user, roles, permissions);
            }),
            total,
        };
    }

    /**
     * Create user (admin function)
     */
    async create(input: CreateUserInput): Promise<SafeUser> {
        const { email, password, firstName, lastName, roleIds, isActive, isVerified } = input;

        // Check if email exists
        const existing = await prisma.user.findUnique({
            where: { email },
        });

        if (existing) {
            throw new ConflictError('Email already registered');
        }

        // Hash password
        const passwordHash = await passwordService.hash(password);

        // Create user
        const user = await prisma.user.create({
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
        const permissions = user.userRoles.flatMap((ur) =>
            ur.role.rolePermissions.map((rp) => rp.permission.name)
        );

        return this.sanitizeUser(user, roles, permissions);
    }

    /**
     * Update user
     */
    async update(id: string, input: UpdateUserInput): Promise<SafeUser> {
        const user = await prisma.user.update({
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
        const permissions = user.userRoles.flatMap((ur) =>
            ur.role.rolePermissions.map((rp) => rp.permission.name)
        );

        return this.sanitizeUser(user, roles, permissions);
    }

    /**
     * Delete user
     */
    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: { id },
        });

        logger.info({ userId: id }, 'User deleted');
    }

    /**
     * Assign role to user
     */
    async assignRole(userId: string, roleId: string): Promise<void> {
        // Check if already assigned
        const existing = await prisma.userRole.findUnique({
            where: {
                userId_roleId: { userId, roleId },
            },
        });

        if (existing) {
            throw new ConflictError('Role already assigned to user');
        }

        await prisma.userRole.create({
            data: { userId, roleId },
        });

        logger.info({ userId, roleId }, 'Role assigned to user');
    }

    /**
     * Remove role from user
     */
    async removeRole(userId: string, roleId: string): Promise<void> {
        await prisma.userRole.delete({
            where: {
                userId_roleId: { userId, roleId },
            },
        });

        logger.info({ userId, roleId }, 'Role removed from user');
    }

    /**
     * Sanitize user for response
     */
    private sanitizeUser(
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            isActive: boolean;
            isVerified: boolean;
            emailVerifiedAt: Date | null;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        },
        roles: string[],
        permissions: string[]
    ): SafeUser {
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

// Export singleton instance
export const userService = new UserService();
