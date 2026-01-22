/**
 * Custom Error Classes for the Auth Backend
 */
/**
 * Base application error
 */
export declare class AppError extends Error {
    readonly statusCode: number;
    code: string;
    readonly isOperational: boolean;
    readonly details?: unknown;
    constructor(message: string, statusCode: number, code: string, isOperational?: boolean, details?: unknown);
}
/**
 * Bad Request Error (400)
 */
export declare class BadRequestError extends AppError {
    constructor(message?: string, details?: unknown);
}
/**
 * Validation Error (400)
 */
export declare class ValidationError extends AppError {
    constructor(message?: string, details?: unknown);
}
/**
 * Unauthorized Error (401)
 */
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
/**
 * Forbidden Error (403)
 */
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
/**
 * Not Found Error (404)
 */
export declare class NotFoundError extends AppError {
    constructor(resource?: string);
}
/**
 * Conflict Error (409)
 */
export declare class ConflictError extends AppError {
    constructor(message: string);
}
/**
 * Too Many Requests Error (429)
 */
export declare class TooManyRequestsError extends AppError {
    constructor(message?: string);
}
/**
 * Internal Server Error (500)
 */
export declare class InternalError extends AppError {
    constructor(message?: string);
}
/**
 * Authentication specific errors
 */
export declare class InvalidCredentialsError extends UnauthorizedError {
    constructor();
}
export declare class TokenExpiredError extends UnauthorizedError {
    constructor();
}
export declare class TokenRevokedError extends UnauthorizedError {
    constructor();
}
export declare class AccountLockedError extends UnauthorizedError {
    constructor(remainingMinutes: number);
}
export declare class AccountInactiveError extends ForbiddenError {
    constructor();
}
//# sourceMappingURL=errors.d.ts.map