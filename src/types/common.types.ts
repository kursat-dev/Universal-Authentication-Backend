import type { Request } from 'express';
import type { SafeUser, JwtPayload } from './auth.types.js';

/**
 * Extend Express Request to include authenticated user
 */
declare global {
    namespace Express {
        interface Request {
            user?: SafeUser;
            jwtPayload?: JwtPayload;
        }
    }
}

/**
 * Request with guaranteed authenticated user
 */
export interface AuthenticatedRequest extends Request {
    user: SafeUser;
    jwtPayload: JwtPayload;
}

/**
 * Pagination query parameters
 */
export interface PaginationQuery {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated result
 */
export interface PaginatedResult<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
