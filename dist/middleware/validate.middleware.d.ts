import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
/**
 * Validation Middleware Factory
 * Validates request body, query, and params against a Zod schema
 */
export declare function validate(schema: AnyZodObject): (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validate.middleware.d.ts.map