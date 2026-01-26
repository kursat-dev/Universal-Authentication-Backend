import { z } from 'zod';

/**
 * Password validation schema
 * - Minimum 8 characters
 * - At least one uppercase, one lowercase, one number, one special char
 */
const passwordSchema = z
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
const emailSchema = z.string().email('Invalid email address').toLowerCase().trim();

/**
 * Register user schema
 */
export const registerSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: passwordSchema,
        firstName: z.string().min(1).max(100).optional(),
        lastName: z.string().min(1).max(100).optional(),
    }),
});

/**
 * Login schema
 */
export const loginSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: z.string().min(1, 'Password is required'),
    }),
});

/**
 * Refresh token schema
 */
export const refreshTokenSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(1, 'Refresh token is required'),
    }),
});

/**
 * Forgot password schema
 */
export const forgotPasswordSchema = z.object({
    body: z.object({
        email: emailSchema,
    }),
});

/**
 * Reset password schema
 */
export const resetPasswordSchema = z.object({
    body: z.object({
        token: z.string().min(1, 'Token is required'),
        password: passwordSchema,
    }),
});

/**
 * Change password schema (for logged-in users)
 */
export const changePasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: passwordSchema,
    }),
});

/**
 * OAuth Callback schema
 */
export const oauthCallbackSchema = z.object({
    body: z.object({
        code: z.string().min(1, 'Authorization code is required'),
    }),
    params: z.object({
        provider: z.enum(['google', 'github']),
    }),
});
