import { NextFunction, Request, Response } from 'express';
import { rbacService } from '../services/rbac.service.js';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';

/**
 * Permission Guard Middleware Factory
 * Checks if user has required permission(s)
 *
 * @param permissions - Single permission or array (any match)
 */
export function requirePermission(...permissions: string[]) {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new UnauthorizedError('Authentication required');
            }

            // Check if user has admin role (bypass permission check)
            if (req.user.roles.includes('admin')) {
                return next();
            }

            // Check if user has any of the required permissions
            const hasPermission = permissions.some((p) => req.user.permissions.includes(p));
            if (!hasPermission) {
                throw new ForbiddenError(`Required permission: ${permissions.join(' or ')}`);
            }

            next();
        } catch (error) {
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
export function requireRole(...roles: string[]) {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new UnauthorizedError('Authentication required');
            }

            // Check if user has any of the required roles
            const hasRole = roles.some((r) => req.user.roles.includes(r));
            if (!hasRole) {
                throw new ForbiddenError(`Required role: ${roles.join(' or ')}`);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

/**
 * Dynamic Permission Check
 * For runtime permission checks (not middleware)
 */
export async function checkPermission(userId: string, permission: string): Promise<boolean> {
    return rbacService.hasPermission(userId, permission);
}

/**
 * Self or Admin Guard
 * Allows access if user is accessing their own resource or is admin
 */
export function requireSelfOrAdmin(userIdParam = 'id') {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new UnauthorizedError('Authentication required');
            }

            const targetId = req.params[userIdParam];
            const isAdmin = req.user.roles.includes('admin');
            const isSelf = req.user.id === targetId;

            if (!isAdmin && !isSelf) {
                throw new ForbiddenError('Access denied');
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}
