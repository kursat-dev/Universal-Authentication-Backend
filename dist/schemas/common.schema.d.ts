import { z } from 'zod';
/**
 * UUID param schema
 */
export declare const uuidParamSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
}, {
    params: {
        id: string;
    };
}>;
/**
 * Pagination query schema
 */
export declare const paginationSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodPipeline<z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>, z.ZodNumber>;
        limit: z.ZodPipeline<z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>, z.ZodNumber>;
        sortBy: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        sortOrder: "asc" | "desc";
        sortBy?: string | undefined;
    }, {
        limit?: string | undefined;
        page?: string | undefined;
        sortBy?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        sortOrder: "asc" | "desc";
        sortBy?: string | undefined;
    };
}, {
    query: {
        limit?: string | undefined;
        page?: string | undefined;
        sortBy?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
    };
}>;
export type UuidParam = z.infer<typeof uuidParamSchema>['params'];
export type PaginationInput = z.infer<typeof paginationSchema>['query'];
//# sourceMappingURL=common.schema.d.ts.map