import { Response } from 'express';

/**
 * Standard API Response structure
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: ApiError;
    meta?: ResponseMeta;
}

export interface ApiError {
    code: string;
    message: string;
    details?: unknown;
}

export interface ResponseMeta {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
}

/**
 * Response helper class for consistent API responses
 */
export class ResponseHelper {
    /**
     * Send success response
     */
    static success<T>(res: Response, data: T, statusCode = 200, meta?: ResponseMeta): Response {
        const response: ApiResponse<T> = {
            success: true,
            data,
        };
        if (meta) {
            response.meta = meta;
        }
        return res.status(statusCode).json(response);
    }

    /**
     * Send created response (201)
     */
    static created<T>(res: Response, data: T): Response {
        return this.success(res, data, 201);
    }

    /**
     * Send no content response (204)
     */
    static noContent(res: Response): Response {
        return res.status(204).send();
    }

    /**
     * Send error response
     */
    static error(
        res: Response,
        code: string,
        message: string,
        statusCode = 400,
        details?: unknown
    ): Response {
        const response: ApiResponse = {
            success: false,
            error: {
                code,
                message,
                details,
            },
        };
        return res.status(statusCode).json(response);
    }

    /**
     * Send validation error response
     */
    static validationError(res: Response, details: unknown): Response {
        return this.error(res, 'VALIDATION_ERROR', 'Invalid request data', 400, details);
    }

    /**
     * Send unauthorized response
     */
    static unauthorized(res: Response, message = 'Unauthorized'): Response {
        return this.error(res, 'UNAUTHORIZED', message, 401);
    }

    /**
     * Send forbidden response
     */
    static forbidden(res: Response, message = 'Forbidden'): Response {
        return this.error(res, 'FORBIDDEN', message, 403);
    }

    /**
     * Send not found response
     */
    static notFound(res: Response, resource = 'Resource'): Response {
        return this.error(res, 'NOT_FOUND', `${resource} not found`, 404);
    }

    /**
     * Send conflict response
     */
    static conflict(res: Response, message: string): Response {
        return this.error(res, 'CONFLICT', message, 409);
    }

    /**
     * Send too many requests response
     */
    static tooManyRequests(res: Response, message = 'Too many requests'): Response {
        return this.error(res, 'TOO_MANY_REQUESTS', message, 429);
    }

    /**
     * Send internal server error response
     */
    static internalError(res: Response, message = 'Internal server error'): Response {
        return this.error(res, 'INTERNAL_ERROR', message, 500);
    }
}
