import type { Role, Permission } from '@prisma/client';
/**
 * Role-Based Access Control Service
 */
export declare class RbacService {
    /**
     * Check if user has a specific permission
     */
    hasPermission(userId: string, permissionName: string): Promise<boolean>;
    /**
     * Check if user has any of the specified permissions
     */
    hasAnyPermission(userId: string, permissionNames: string[]): Promise<boolean>;
    /**
     * Check if user has a specific role
     */
    hasRole(userId: string, roleName: string): Promise<boolean>;
    /**
     * Get all roles
     */
    getAllRoles(): Promise<Role[]>;
    /**
     * Get role by ID
     */
    getRoleById(id: string): Promise<Role & {
        permissions: Permission[];
    }>;
    /**
     * Create a new role
     */
    createRole(name: string, description?: string, permissionIds?: string[]): Promise<Role>;
    /**
     * Update a role
     */
    updateRole(id: string, name?: string, description?: string): Promise<Role>;
    /**
     * Delete a role
     */
    deleteRole(id: string): Promise<void>;
    /**
     * Get all permissions
     */
    getAllPermissions(): Promise<Permission[]>;
    /**
     * Assign permission to role
     */
    assignPermissionToRole(roleId: string, permissionId: string): Promise<void>;
    /**
     * Remove permission from role
     */
    removePermissionFromRole(roleId: string, permissionId: string): Promise<void>;
}
export declare const rbacService: RbacService;
//# sourceMappingURL=rbac.service.d.ts.map