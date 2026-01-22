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
export declare class ResponseHelper {
    /**
     * Send success response
     */
    static success<T>(res: Response, data: T, statusCode?: number, meta?: ResponseMeta): Response;
    /**
     * Send created response (201)
     */
    static created<T>(res: Response, data: T): Response;
    /**
     * Send no content response (204)
     */
    static noContent(res: Response): Response;
    /**
     * Send error response
     */
    static error(res: Response, code: string, message: string, statusCode?: number, details?: unknown): Response;
    /**
     * Send validation error response
     */
    static validationError(res: Response, details: unknown): Response;
    /**
     * Send unauthorized response
     */
    static unauthorized(res: Response, message?: string): Response;
    /**
     * Send forbidden response
     */
    static forbidden(res: Response, message?: string): Response;
    /**
     * Send not found response
     */
    static notFound(res: Response, resource?: string): Response;
    /**
     * Send conflict response
     */
    static conflict(res: Response, message: string): Response;
    /**
     * Send too many requests response
     */
    static tooManyRequests(res: Response, message?: string): Response;
    /**
     * Send internal server error response
     */
    static internalError(res: Response, message?: string): Response;
}
//# sourceMappingURL=response.d.ts.map