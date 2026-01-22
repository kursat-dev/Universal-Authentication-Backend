"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
exports.notFoundHandler = notFoundHandler;
exports.asyncHandler = asyncHandler;
const zod_1 = require("zod");
const errors_js_1 = require("../utils/errors.js");
const logger_js_1 = require("../utils/logger.js");
const logger = (0, logger_js_1.createLogger)('error-handler');
/**
 * Format Zod validation errors for API response
 */
function formatZodError(error) {
    return error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
    }));
}
/**
 * Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, _next) => {
    // Log the error
    logger.error({
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    }, 'Request error');
    // Handle Zod validation errors
    if (err instanceof zod_1.ZodError) {
        const validationError = new errors_js_1.ValidationError('Validation failed', formatZodError(err));
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
    if (err instanceof errors_js_1.AppError) {
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
    const internalError = new errors_js_1.InternalError();
    // Don't expose internal error details in production
    const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
    res.status(internalError.statusCode).json({
        success: false,
        error: {
            code: internalError.code,
            message,
        },
    });
};
exports.errorHandler = errorHandler;
/**
 * Not Found Handler (404)
 */
function notFoundHandler(req, res) {
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
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
//# sourceMappingURL=error.middleware.js.map