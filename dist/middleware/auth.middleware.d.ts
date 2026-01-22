import { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types/common.types.js';
/**
 * Authentication Middleware
 * Verifies JWT access token and attaches user to request
 */
export declare function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void>;
/**
 * Optional Authentication Middleware
 * Attaches user if token present, but doesn't require it
 */
export declare function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void>;
/**
 * Type guard for authenticated requests
 */
export declare function isAuthenticated(req: Request): req is AuthenticatedRequest;
//# sourceMappingURL=auth.middleware.d.ts.map