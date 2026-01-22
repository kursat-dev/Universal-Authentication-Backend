"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRoleSchema = exports.assignRoleSchema = exports.getUserSchema = exports.updateUserSchema = exports.createUserSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
/**
 * Update current user profile
 */
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().min(1).max(100).optional(),
        lastName: zod_1.z.string().min(1).max(100).optional(),
    }),
});
/**
 * Create user (admin only)
 */
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address').toLowerCase().trim(),
        password: zod_1.z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .max(128, 'Password must be at most 128 characters'),
        firstName: zod_1.z.string().min(1).max(100).optional(),
        lastName: zod_1.z.string().min(1).max(100).optional(),
        roleIds: zod_1.z.array(zod_1.z.string().uuid()).optional(),
        isActive: zod_1.z.boolean().optional(),
        isVerified: zod_1.z.boolean().optional(),
    }),
});
/**
 * Update user (admin only)
 */
exports.updateUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid user ID'),
    }),
    body: zod_1.z.object({
        firstName: zod_1.z.string().min(1).max(100).optional(),
        lastName: zod_1.z.string().min(1).max(100).optional(),
        isActive: zod_1.z.boolean().optional(),
        isVerified: zod_1.z.boolean().optional(),
    }),
});
/**
 * Get user by ID
 */
exports.getUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid user ID'),
    }),
});
/**
 * Assign role to user
 */
exports.assignRoleSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid user ID'),
    }),
    body: zod_1.z.object({
        roleId: zod_1.z.string().uuid('Invalid role ID'),
    }),
});
/**
 * Remove role from user
 */
exports.removeRoleSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid user ID'),
        roleId: zod_1.z.string().uuid('Invalid role ID'),
    }),
});
//# sourceMappingURL=user.schema.js.map