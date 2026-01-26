import { Response } from 'express';

/**
 * Response helper class for consistent API responses
 */
export class ResponseHelper {
    /**
     * Send success response
     */
    static success(res: Response, data: any, statusCode = 200, meta?: any) {
        const response: any = {
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
    static created(res: Response, data: any) {
        return this.success(res, data, 201);
    }

    /**
     * Send no content response (204)
     */
    static noContent(res: Response) {
        return res.status(204).send();
    }

    /**
     * Send error response
     */
    static error(res: Response, code: string, message: string, statusCode = 400, details?: any) {
        const response = {
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
    static validationError(res: Response, details: any) {
        return this.error(res, 'VALIDATION_ERROR', 'Invalid request data', 400, details);
    }

    /**
     * Send unauthorized response
     */
    static unauthorized(res: Response, message = 'Unauthorized') {
        return this.error(res, 'UNAUTHORIZED', message, 401);
    }

    /**
     * Send forbidden response
     */
    static forbidden(res: Response, message = 'Forbidden') {
        return this.error(res, 'FORBIDDEN', message, 403);
    }

    /**
     * Send not found response
     */
    static notFound(res: Response, resource = 'Resource') {
        return this.error(res, 'NOT_FOUND', `${resource} not found`, 404);
    }

    /**
     * Send conflict response
     */
    static conflict(res: Response, message: string) {
        return this.error(res, 'CONFLICT', message, 409);
    }

    /**
     * Send too many requests response
     */
    static tooManyRequests(res: Response, message = 'Too many requests') {
        return this.error(res, 'TOO_MANY_REQUESTS', message, 429);
    }

    /**
     * Send internal server error response
     */
    static internalError(res: Response, message = 'Internal server error') {
        return this.error(res, 'INTERNAL_ERROR', message, 500);
    }
}
