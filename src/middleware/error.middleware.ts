import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError, InternalError, ValidationError } from '../utils/errors.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('error-handler');

/**
 * Format Zod validation errors for API response
 */
function formatZodError(error: ZodError): { field: string; message: string }[] {
    return error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
    }));
}

/**
 * Centralized Error Handling Middleware
 */
export const errorHandler: ErrorRequestHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // Log the error
    logger.error(
        {
            error: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method,
        },
        'Request error'
    );

    // Handle Zod validation errors
    if (err instanceof ZodError) {
        const validationError = new ValidationError('Validation failed', formatZodError(err));
        res.status(validationError.statusCode).json({
            success: false,
            error: {
                code: validationError.code,
                message: validationError.message,
                details: validationError.details,
            },
        });
        return;
    }

    // Handle known application errors
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                details: err.details,
            },
        });
        return;
    }

    // Handle unknown errors
    const internalError = new InternalError();

    // Don't expose internal error details in production
    const message =
        process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;

    res.status(internalError.statusCode).json({
        success: false,
        error: {
            code: internalError.code,
            message,
        },
    });
};

/**
 * Not Found Handler (404)
 */
export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Route ${req.method} ${req.path} not found`,
        },
    });
}

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors automatically
 */
export function asyncHandler<T>(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
