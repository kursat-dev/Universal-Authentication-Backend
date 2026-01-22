import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

/**
 * Seed the database with initial data
 */
async function seed(): Promise<void> {
    console.log('🌱 Seeding database...');

    // Create permissions
    const permissions = [
        // User permissions
        { name: 'user:create', resource: 'user', action: 'create', description: 'Create users' },
        { name: 'user:read', resource: 'user', action: 'read', description: 'Read user data' },
        { name: 'user:update', resource: 'user', action: 'update', description: 'Update users' },
        { name: 'user:delete', resource: 'user', action: 'delete', description: 'Delete users' },
        // Role permissions
        { name: 'role:create', resource: 'role', action: 'create', description: 'Create roles' },
        { name: 'role:read', resource: 'role', action: 'read', description: 'Read roles' },
        { name: 'role:update', resource: 'role', action: 'update', description: 'Update roles' },
        { name: 'role:delete', resource: 'role', action: 'delete', description: 'Delete roles' },
        // Profile permissions
        { name: 'profile:read', resource: 'profile', action: 'read', description: 'Read own profile' },
        { name: 'profile:update', resource: 'profile', action: 'update', description: 'Update own profile' },
        // Wildcard permission
        { name: '*:*', resource: '*', action: '*', description: 'Full access to all resources' },
    ];

    console.log('  Creating permissions...');
    for (const perm of permissions) {
        await prisma.permission.upsert({
            where: { name: perm.name },
            update: {},
            create: perm,
        });
    }

    // Create roles
    console.log('  Creating roles...');

    // Admin role with all permissions
    const adminRole = await prisma.role.upsert({
        where: { name: 'admin' },
        update: {},
        create: {
            name: 'admin',
            description: 'Administrator with full access',
            isSystem: true,
        },
    });

    // Assign wildcard permission to admin
    const wildcardPerm = await prisma.permission.findUnique({ where: { name: '*:*' } });
    if (wildcardPerm) {
        await prisma.rolePermission.upsert({
            where: { roleId_permissionId: { roleId: adminRole.id, permissionId: wildcardPerm.id } },
            update: {},
            create: { roleId: adminRole.id, permissionId: wildcardPerm.id },
        });
    }

    // Moderator role
    const moderatorRole = await prisma.role.upsert({
        where: { name: 'moderator' },
        update: {},
        create: {
            name: 'moderator',
            description: 'Moderator with user management access',
            isSystem: true,
        },
    });

    // Assign moderator permissions
    const modPerms = ['user:read', 'user:update', 'role:read'];
    for (const permName of modPerms) {
        const perm = await prisma.permission.findUnique({ where: { name: permName } });
        if (perm) {
            await prisma.rolePermission.upsert({
                where: { roleId_permissionId: { roleId: moderatorRole.id, permissionId: perm.id } },
                update: {},
                create: { roleId: moderatorRole.id, permissionId: perm.id },
            });
        }
    }

    // User role
    const userRole = await prisma.role.upsert({
        where: { name: 'user' },
        update: {},
        create: {
            name: 'user',
            description: 'Regular user with basic access',
            isSystem: true,
        },
    });

    // Assign user permissions
    const userPerms = ['profile:read', 'profile:update'];
    for (const permName of userPerms) {
        const perm = await prisma.permission.findUnique({ where: { name: permName } });
        if (perm) {
            await prisma.rolePermission.upsert({
                where: { roleId_permissionId: { roleId: userRole.id, permissionId: perm.id } },
                update: {},
                create: { roleId: userRole.id, permissionId: perm.id },
            });
        }
    }

    // Create default admin user
    console.log('  Creating default admin user...');
    const adminPassword = await argon2.hash('Admin@123456');

    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            passwordHash: adminPassword,
            firstName: 'System',
            lastName: 'Admin',
            isActive: true,
            isVerified: true,
            emailVerifiedAt: new Date(),
        },
    });

    // Assign admin role to admin user
    await prisma.userRole.upsert({
        where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
        update: {},
        create: { userId: adminUser.id, roleId: adminRole.id },
    });

    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('📧 Default admin credentials:');
    console.log('   Email: admin@example.com');
    console.log('   Password: Admin@123456');
    console.log('');
    console.log('⚠️  Please change the admin password after first login!');
}

seed()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
