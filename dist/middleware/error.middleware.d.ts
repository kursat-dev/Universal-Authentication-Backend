import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
/**
 * Centralized Error Handling Middleware
 */
export declare const errorHandler: ErrorRequestHandler;
/**
 * Not Found Handler (404)
 */
export declare function notFoundHandler(req: Request, res: Response): void;
/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors automatically
 */
export declare function asyncHandler<T>(fn: (req: Request, res: Response, next: NextFunction) => Promise<T>): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=error.middleware.d.ts.map