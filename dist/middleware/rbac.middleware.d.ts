import { Request, Response, NextFunction } from 'express';
/**
 * Permission Guard Middleware Factory
 * Checks if user has required permission(s)
 *
 * @param permissions - Single permission or array (any match)
 */
export declare function requirePermission(...permissions: string[]): (req: Request, _res: Response, next: NextFunction) => Promise<void>;
/**
 * Role Guard Middleware Factory
 * Checks if user has required role(s)
 *
 * @param roles - Single role or array (any match)
 */
export declare function requireRole(...roles: string[]): (req: Request, _res: Response, next: NextFunction) => Promise<void>;
/**
 * Dynamic Permission Check
 * For runtime permission checks (not middleware)
 */
export declare function checkPermission(userId: string, permission: string): Promise<boolean>;
/**
 * Self or Admin Guard
 * Allows access if user is accessing their own resource or is admin
 */
export declare function requireSelfOrAdmin(userIdParam?: string): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=rbac.middleware.d.ts.map