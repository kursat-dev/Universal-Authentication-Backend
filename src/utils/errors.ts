/**
 * Base application error
 */
export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number,
        public code: string,
        public isOperational = true,
        public details?: any
    ) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

/**
 * Bad Request Error (400)
 */
export class BadRequestError extends AppError {
    constructor(message = 'Bad request', details?: any) {
        super(message, 400, 'BAD_REQUEST', true, details);
    }
}

/**
 * Validation Error (400)
 */
export class ValidationError extends AppError {
    constructor(message = 'Validation failed', details?: any) {
        super(message, 400, 'VALIDATION_ERROR', true, details);
    }
}

/**
 * Unauthorized Error (401)
 */
export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401, 'UNAUTHORIZED', true);
    }
}

/**
 * Forbidden Error (403)
 */
export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403, 'FORBIDDEN', true);
    }
}

/**
 * Not Found Error (404)
 */
export class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404, 'NOT_FOUND', true);
    }
}

/**
 * Conflict Error (409)
 */
export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409, 'CONFLICT', true);
    }
}

/**
 * Too Many Requests Error (429)
 */
export class TooManyRequestsError extends AppError {
    constructor(message = 'Too many requests') {
        super(message, 429, 'TOO_MANY_REQUESTS', true);
    }
}

/**
 * Internal Server Error (500)
 */
export class InternalError extends AppError {
    constructor(message = 'Internal server error') {
        super(message, 500, 'INTERNAL_ERROR', false);
    }
}

/**
 * Authentication specific errors
 */
export class InvalidCredentialsError extends UnauthorizedError {
    constructor() {
        super('Invalid email or password');
        this.code = 'INVALID_CREDENTIALS';
    }
}

export class TokenExpiredError extends UnauthorizedError {
    constructor() {
        super('Token has expired');
        this.code = 'TOKEN_EXPIRED';
    }
}

export class TokenRevokedError extends UnauthorizedError {
    constructor() {
        super('Token has been revoked');
        this.code = 'TOKEN_REVOKED';
    }
}

export class AccountLockedError extends UnauthorizedError {
    constructor(remainingMinutes: number) {
        super(`Account is locked. Try again in ${remainingMinutes} minutes`);
        this.code = 'ACCOUNT_LOCKED';
    }
}

export class AccountInactiveError extends ForbiddenError {
    constructor() {
        super('Account is inactive');
        this.code = 'ACCOUNT_INACTIVE';
    }
}
