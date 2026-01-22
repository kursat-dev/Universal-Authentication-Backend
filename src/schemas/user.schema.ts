import { z } from 'zod';

/**
 * Update current user profile
 */
export const updateProfileSchema = z.object({
    body: z.object({
        firstName: z.string().min(1).max(100).optional(),
        lastName: z.string().min(1).max(100).optional(),
    }),
});

/**
 * Create user (admin only)
 */
export const createUserSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address').toLowerCase().trim(),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .max(128, 'Password must be at most 128 characters'),
        firstName: z.string().min(1).max(100).optional(),
        lastName: z.string().min(1).max(100).optional(),
        roleIds: z.array(z.string().uuid()).optional(),
        isActive: z.boolean().optional(),
        isVerified: z.boolean().optional(),
    }),
});

/**
 * Update user (admin only)
 */
export const updateUserSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid user ID'),
    }),
    body: z.object({
        firstName: z.string().min(1).max(100).optional(),
        lastName: z.string().min(1).max(100).optional(),
        isActive: z.boolean().optional(),
        isVerified: z.boolean().optional(),
    }),
});

/**
 * Get user by ID
 */
export const getUserSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid user ID'),
    }),
});

/**
 * Assign role to user
 */
export const assignRoleSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid user ID'),
    }),
    body: z.object({
        roleId: z.string().uuid('Invalid role ID'),
    }),
});

/**
 * Remove role from user
 */
export const removeRoleSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid user ID'),
        roleId: z.string().uuid('Invalid role ID'),
    }),
});

// Type exports
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
