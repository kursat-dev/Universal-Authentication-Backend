"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHelper = void 0;
/**
 * Response helper class for consistent API responses
 */
class ResponseHelper {
    /**
     * Send success response
     */
    static success(res, data, statusCode = 200, meta) {
        const response = {
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
    static created(res, data) {
        return this.success(res, data, 201);
    }
    /**
     * Send no content response (204)
     */
    static noContent(res) {
        return res.status(204).send();
    }
    /**
     * Send error response
     */
    static error(res, code, message, statusCode = 400, details) {
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
    static validationError(res, details) {
        return this.error(res, 'VALIDATION_ERROR', 'Invalid request data', 400, details);
    }
    /**
     * Send unauthorized response
     */
    static unauthorized(res, message = 'Unauthorized') {
        return this.error(res, 'UNAUTHORIZED', message, 401);
    }
    /**
     * Send forbidden response
     */
    static forbidden(res, message = 'Forbidden') {
        return this.error(res, 'FORBIDDEN', message, 403);
    }
    /**
     * Send not found response
     */
    static notFound(res, resource = 'Resource') {
        return this.error(res, 'NOT_FOUND', `${resource} not found`, 404);
    }
    /**
     * Send conflict response
     */
    static conflict(res, message) {
        return this.error(res, 'CONFLICT', message, 409);
    }
    /**
     * Send too many requests response
     */
    static tooManyRequests(res, message = 'Too many requests') {
        return this.error(res, 'TOO_MANY_REQUESTS', message, 429);
    }
    /**
     * Send internal server error response
     */
    static internalError(res, message = 'Internal server error') {
        return this.error(res, 'INTERNAL_ERROR', message, 500);
    }
}
exports.ResponseHelper = ResponseHelper;
//# sourceMappingURL=response.js.map