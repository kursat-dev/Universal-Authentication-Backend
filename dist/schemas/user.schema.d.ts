import { z } from 'zod';
/**
 * Update current user profile
 */
export declare const updateProfileSchema: z.ZodObject<{
    body: z.ZodObject<{
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        firstName?: string | undefined;
        lastName?: string | undefined;
    }, {
        firstName?: string | undefined;
        lastName?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        firstName?: string | undefined;
        lastName?: string | undefined;
    };
}, {
    body: {
        firstName?: string | undefined;
        lastName?: string | undefined;
    };
}>;
/**
 * Create user (admin only)
 */
export declare const createUserSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        roleIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        isActive: z.ZodOptional<z.ZodBoolean>;
        isVerified: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
        firstName?: string | undefined;
        lastName?: string | undefined;
        isActive?: boolean | undefined;
        isVerified?: boolean | undefined;
        roleIds?: string[] | undefined;
    }, {
        email: string;
        password: string;
        firstName?: string | undefined;
        lastName?: string | undefined;
        isActive?: boolean | undefined;
        isVerified?: boolean | undefined;
        roleIds?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
        firstName?: string | undefined;
        lastName?: string | undefined;
        isActive?: boolean | undefined;
        isVerified?: boolean | undefined;
        roleIds?: string[] | undefined;
    };
}, {
    body: {
        email: string;
        password: string;
        firstName?: string | undefined;
        lastName?: string | undefined;
        isActive?: boolean | undefined;
        isVerified?: boolean | undefined;
        roleIds?: string[] | undefined;
    };
}>;
/**
 * Update user (admin only)
 */
export declare const updateUserSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodBoolean>;
        isVerified: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        firstName?: string | undefined;
        lastName?: string | undefined;
        isActive?: boolean | undefined;
        isVerified?: boolean | undefined;
    }, {
        firstName?: string | undefined;
        lastName?: string | undefined;
        isActive?: boolean | undefined;
        isVerified?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        firstName?: string | undefined;
        lastName?: string | undefined;
        isActive?: boolean | undefined;
        isVerified?: boolean | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        firstName?: string | undefined;
        lastName?: string | undefined;
        isActive?: boolean | undefined;
        isVerified?: boolean | undefined;
    };
}>;
/**
 * Get user by ID
 */
export declare const getUserSchema: z.ZodObject<{
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
 * Assign role to user
 */
export declare const assignRoleSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        roleId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        roleId: string;
    }, {
        roleId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        roleId: string;
    };
}, {
    params: {
        id: string;
    };
    body: {
        roleId: string;
    };
}>;
/**
 * Remove role from user
 */
export declare const removeRoleSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
        roleId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        roleId: string;
    }, {
        id: string;
        roleId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
        roleId: string;
    };
}, {
    params: {
        id: string;
        roleId: string;
    };
}>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
//# sourceMappingURL=user.schema.d.ts.map