"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
/**
 * Password validation schema
 * - Minimum 8 characters
 * - At least one uppercase, one lowercase, one number, one special char
 */
const passwordSchema = zod_1.z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');
/**
 * Email validation schema
 */
const emailSchema = zod_1.z.string().email('Invalid email address').toLowerCase().trim();
/**
 * Register user schema
 */
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: emailSchema,
        password: passwordSchema,
        firstName: zod_1.z.string().min(1).max(100).optional(),
        lastName: zod_1.z.string().min(1).max(100).optional(),
    }),
});
/**
 * Login schema
 */
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: emailSchema,
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
/**
 * Refresh token schema
 */
exports.refreshTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
    }),
});
/**
 * Forgot password schema
 */
exports.forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: emailSchema,
    }),
});
/**
 * Reset password schema
 */
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string().min(1, 'Token is required'),
        password: passwordSchema,
    }),
});
/**
 * Change password schema (for logged-in users)
 */
exports.changePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string().min(1, 'Current password is required'),
        newPassword: passwordSchema,
    }),
});
//# sourceMappingURL=auth.schema.js.map