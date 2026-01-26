import { prisma } from '../database/connection.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { passwordService } from './password.service.js';

export class UserService {
    async getById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                userRoles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        if (!user) {
            throw new NotFoundError('User');
        }
        return user;
    }

    async getAll(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
                include: {
                    userRoles: {
                        include: {
                            role: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count(),
        ]);

        return { users, total };
    }

    async create(data: any) {
        const { email, password, firstName, lastName, roleIds } = data;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new ConflictError('Email already registered');
        }

        const passwordHash = await passwordService.hash(password);

        return prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                lastName,
                userRoles: roleIds
                    ? {
                        create: roleIds.map((roleId: string) => ({ roleId })),
                    }
                    : undefined,
            },
        });
    }

    async update(id: string, data: any) {
        const { firstName, lastName, isActive, isVerified } = data;
        return prisma.user.update({
            where: { id },
            data: {
                firstName,
                lastName,
                isActive,
                isVerified,
            },
        });
    }

    async delete(id: string) {
        return prisma.user.delete({
            where: { id },
        });
    }

    async assignRole(userId: string, roleId: string) {
        return prisma.userRole.create({
            data: {
                userId,
                roleId,
            },
        });
    }

    async removeRole(userId: string, roleId: string) {
        return prisma.userRole.delete({
            where: {
                userId_roleId: { userId, roleId },
            },
        });
    }
}

export const userService = new UserService();
