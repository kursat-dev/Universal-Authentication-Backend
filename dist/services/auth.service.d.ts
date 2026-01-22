import type { AuthResponse, DeviceInfo } from '../types/auth.types.js';
import type { RegisterInput, LoginInput } from '../schemas/auth.schema.js';
/**
 * Auth Service
 * Core authentication logic
 */
export declare class AuthService {
    /**
     * Register a new user
     */
    register(input: RegisterInput, deviceInfo?: DeviceInfo): Promise<AuthResponse>;
    /**
     * Login user
     */
    login(input: LoginInput, deviceInfo?: DeviceInfo): Promise<AuthResponse>;
    /**
     * Logout (revoke current refresh token)
     */
    logout(refreshToken: string): Promise<void>;
    /**
     * Logout from all devices
     */
    logoutAll(userId: string): Promise<void>;
    /**
     * Request password reset
     */
    forgotPassword(email: string): Promise<void>;
    /**
     * Reset password with token
     */
    resetPassword(token: string, newPassword: string): Promise<void>;
    /**
     * Check if account is locked due to too many failed attempts
     */
    private checkAccountLockout;
    /**
     * Record login attempt for brute force protection
     */
    private recordLoginAttempt;
    /**
     * Convert user to safe format (no sensitive data)
     */
    private sanitizeUser;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map