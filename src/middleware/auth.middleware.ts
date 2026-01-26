import { NextFunction, Request, Response } from 'express';
import { tokenService } from '../services/token.service.js';
import { userService } from '../services/user.service.js';
import { UnauthorizedError } from '../utils/errors.js';
import type { JwtPayload } from '../types/auth.types.js';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: any;
            jwtPayload?: JwtPayload;
        }
    }
}

/**
 * Extract Bearer token from Authorization header
 */
function extractBearerToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}

/**
 * Authentication Middleware
 * Verifies JWT access token and attaches user to request
 */
export async function authenticate(req: Request, _res: Response, next: NextFunction) {
    try {
        const token = extractBearerToken(req);
        if (!token) {
            throw new UnauthorizedError('No token provided');
        }

        // Verify token
        const payload = tokenService.verifyAccessToken(token);

        // Get fresh user data
        const user = await userService.getById(payload.sub);

        // Check if user is active
        if (!user.isActive) {
            throw new UnauthorizedError('Account is inactive');
        }

        // Attach user and payload to request
        req.user = user;
        req.jwtPayload = payload;

        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Optional Authentication Middleware
 * Attaches user if token present, but doesn't require it
 */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
    try {
        const token = extractBearerToken(req);
        if (token) {
            const payload = tokenService.verifyAccessToken(token);
            const user = await userService.getById(payload.sub);
            if (user.isActive) {
                req.user = user;
                req.jwtPayload = payload;
            }
        }
        next();
    } catch {
        // Ignore errors, continue without auth
        next();
    }
}

/**
 * Type guard for authenticated requests
 */
export function isAuthenticated(req: Request) {
    return !!req.user && !!req.jwtPayload;
}
