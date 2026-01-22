import { z } from 'zod';

/**
 * UUID param schema
 */
export const uuidParamSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid ID format'),
    }),
});

/**
 * Pagination query schema
 */
export const paginationSchema = z.object({
    query: z.object({
        page: z
            .string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 1))
            .pipe(z.number().int().positive()),
        limit: z
            .string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 10))
            .pipe(z.number().int().min(1).max(100)),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
    }),
});

// Type exports
export type UuidParam = z.infer<typeof uuidParamSchema>['params'];
export type PaginationInput = z.infer<typeof paginationSchema>['query'];
