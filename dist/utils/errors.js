"use strict";
/**
 * Custom Error Classes for the Auth Backend
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountInactiveError = exports.AccountLockedError = exports.TokenRevokedError = exports.TokenExpiredError = exports.InvalidCredentialsError = exports.InternalError = exports.TooManyRequestsError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.ValidationError = exports.BadRequestError = exports.AppError = void 0;
/**
 * Base application error
 */
class AppError extends Error {
    statusCode;
    code;
    isOperational;
    details;
    constructor(message, statusCode, code, isOperational = true, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
/**
 * Bad Request Error (400)
 */
class BadRequestError extends AppError {
    constructor(message = 'Bad request', details) {
        super(message, 400, 'BAD_REQUEST', true, details);
    }
}
exports.BadRequestError = BadRequestError;
/**
 * Validation Error (400)
 */
class ValidationError extends AppError {
    constructor(message = 'Validation failed', details) {
        super(message, 400, 'VALIDATION_ERROR', true, details);
    }
}
exports.ValidationError = ValidationError;
/**
 * Unauthorized Error (401)
 */
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401, 'UNAUTHORIZED', true);
    }
}
exports.UnauthorizedError = UnauthorizedError;
/**
 * Forbidden Error (403)
 */
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403, 'FORBIDDEN', true);
    }
}
exports.ForbiddenError = ForbiddenError;
/**
 * Not Found Error (404)
 */
class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404, 'NOT_FOUND', true);
    }
}
exports.NotFoundError = NotFoundError;
/**
 * Conflict Error (409)
 */
class ConflictError extends AppError {
    constructor(message) {
        super(message, 409, 'CONFLICT', true);
    }
}
exports.ConflictError = ConflictError;
/**
 * Too Many Requests Error (429)
 */
class TooManyRequestsError extends AppError {
    constructor(message = 'Too many requests') {
        super(message, 429, 'TOO_MANY_REQUESTS', true);
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
/**
 * Internal Server Error (500)
 */
class InternalError extends AppError {
    constructor(message = 'Internal server error') {
        super(message, 500, 'INTERNAL_ERROR', false);
    }
}
exports.InternalError = InternalError;
/**
 * Authentication specific errors
 */
class InvalidCredentialsError extends UnauthorizedError {
    constructor() {
        super('Invalid email or password');
        this.code = 'INVALID_CREDENTIALS';
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
class TokenExpiredError extends UnauthorizedError {
    constructor() {
        super('Token has expired');
        this.code = 'TOKEN_EXPIRED';
    }
}
exports.TokenExpiredError = TokenExpiredError;
class TokenRevokedError extends UnauthorizedError {
    constructor() {
        super('Token has been revoked');
        this.code = 'TOKEN_REVOKED';
    }
}
exports.TokenRevokedError = TokenRevokedError;
class AccountLockedError extends UnauthorizedError {
    constructor(remainingMinutes) {
        super(`Account is locked. Try again in ${remainingMinutes} minutes`);
        this.code = 'ACCOUNT_LOCKED';
    }
}
exports.AccountLockedError = AccountLockedError;
class AccountInactiveError extends ForbiddenError {
    constructor() {
        super('Account is inactive');
        this.code = 'ACCOUNT_INACTIVE';
    }
}
exports.AccountInactiveError = AccountInactiveError;
//# sourceMappingURL=errors.js.map