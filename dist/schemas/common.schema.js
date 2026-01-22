"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = exports.uuidParamSchema = void 0;
const zod_1 = require("zod");
/**
 * UUID param schema
 */
exports.uuidParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid ID format'),
    }),
});
/**
 * Pagination query schema
 */
exports.paginationSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z
            .string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 1))
            .pipe(zod_1.z.number().int().positive()),
        limit: zod_1.z
            .string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 10))
            .pipe(zod_1.z.number().int().min(1).max(100)),
        sortBy: zod_1.z.string().optional(),
        sortOrder: zod_1.z.enum(['asc', 'desc']).optional().default('asc'),
    }),
});
//# sourceMappingURL=common.schema.js.map