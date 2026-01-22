import type { User, Role, Permission } from '@prisma/client';

/**
 * User with roles and permissions loaded
 */
export interface UserWithRoles extends User {
    userRoles: Array<{
        role: Role & {
            rolePermissions: Array<{
                permission: Permission;
            }>;
        };
    }>;
}

/**
 * Sanitized user object for API responses (no sensitive data)
 */
export interface SafeUser {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    isActive: boolean;
    isVerified: boolean;
    emailVerifiedAt: Date | null;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    roles: string[];
    permissions: string[];
}

/**
 * JWT Payload structure
 */
export interface JwtPayload {
    sub: string; // User ID
    email: string;
    roles: string[];
    permissions: string[];
    iat?: number;
    exp?: number;
    iss?: string;
}

/**
 * Token pair for auth responses
 */
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
    expiresIn: number; // seconds
}

/**
 * Auth response with user and tokens
 */
export interface AuthResponse {
    user: SafeUser;
    tokens: TokenPair;
}

/**
 * Device info for token tracking
 */
export interface DeviceInfo {
    userAgent?: string;
    ipAddress?: string;
}
