import type { SafeUser } from '../types/auth.types.js';
import type { CreateUserInput, UpdateUserInput } from '../schemas/user.schema.js';
/**
 * User Service
 * User management operations
 */
export declare class UserService {
    /**
     * Get user by ID
     */
    getById(id: string): Promise<SafeUser>;
    /**
     * Get all users with pagination
     */
    getAll(page?: number, limit?: number): Promise<{
        users: SafeUser[];
        total: number;
    }>;
    /**
     * Create user (admin function)
     */
    create(input: CreateUserInput): Promise<SafeUser>;
    /**
     * Update user
     */
    update(id: string, input: UpdateUserInput): Promise<SafeUser>;
    /**
     * Delete user
     */
    delete(id: string): Promise<void>;
    /**
     * Assign role to user
     */
    assignRole(userId: string, roleId: string): Promise<void>;
    /**
     * Remove role from user
     */
    removeRole(userId: string, roleId: string): Promise<void>;
    /**
     * Sanitize user for response
     */
    private sanitizeUser;
}
export declare const userService: UserService;
//# sourceMappingURL=user.service.d.ts.map