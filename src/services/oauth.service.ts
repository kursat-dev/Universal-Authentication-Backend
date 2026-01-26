import { prisma } from '../database/connection.js';
import { tokenService } from './token.service.js';
import { createLogger } from '../utils/logger.js';
import type { AuthResponse, DeviceInfo, SafeUser } from '../types/auth.types.js';

const logger = createLogger('oauth-service');

export class OAuthService {
    /**
     * Handle OAuth login/register flow
     */
    async handleOAuthCallback(
        provider: 'google' | 'github',
        code: string,
        deviceInfo?: DeviceInfo
    ): Promise<AuthResponse> {
        logger.info({ provider }, 'Handling OAuth callback');

        let oauthUser: {
            id: string;
            email: string;
            firstName?: string;
            lastName?: string;
        };

        if (provider === 'google') {
            oauthUser = await this.getGoogleUser(code);
        } else {
            oauthUser = await this.getGitHubUser(code);
        }

        // 1. Check if account already exists
        const existingAccount = await prisma.account.findUnique({
            where: {
                provider_providerAccountId: {
                    provider,
                    providerAccountId: oauthUser.id,
                },
            },
            include: {
                user: {
                    include: {
                        userRoles: {
                            include: {
                                role: {
                                    include: {
                                        rolePermissions: {
                                            include: {
                                                permission: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        let user;

        if (existingAccount) {
            // Login existing user
            user = existingAccount.user;
            logger.info({ userId: user.id, provider }, 'Existing OAuth user logged in');
        } else {
            // 2. Check if user with same email exists
            const existingUser = await prisma.user.findUnique({
                where: { email: oauthUser.email },
                include: {
                    userRoles: {
                        include: {
                            role: {
                                include: {
                                    rolePermissions: {
                                        include: {
                                            permission: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (existingUser) {
                // Link account to existing user
                user = await prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        accounts: {
                            create: {
                                provider,
                                providerAccountId: oauthUser.id,
                                type: 'oauth',
                            },
                        },
                    },
                    include: {
                        userRoles: {
                            include: {
                                role: {
                                    include: {
                                        rolePermissions: {
                                            include: {
                                                permission: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                logger.info({ userId: user.id, provider }, 'Linked new OAuth provider to existing user');
            } else {
                // 3. Register new user
                const defaultRole = await prisma.role.findUnique({
                    where: { name: 'user' },
                });

                user = await (prisma.user.create as any)({
                    data: {
                        email: oauthUser.email,
                        firstName: oauthUser.firstName,
                        lastName: oauthUser.lastName,
                        isVerified: true, // Social accounts are verified
                        userRoles: defaultRole
                            ? {
                                create: {
                                    roleId: defaultRole.id,
                                },
                            }
                            : undefined,
                        accounts: {
                            create: {
                                provider,
                                providerAccountId: oauthUser.id,
                                type: 'oauth',
                            },
                        },
                    } as any,
                    include: {
                        userRoles: {
                            include: {
                                role: {
                                    include: {
                                        rolePermissions: {
                                            include: {
                                                permission: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                logger.info({ userId: user.id, provider }, 'New user registered via OAuth');
            }
        }

        // Extract roles and permissions
        const anyUser = user as any;
        const roles = anyUser.userRoles.map((ur: any) => ur.role.name);
        const permissions = anyUser.userRoles.flatMap((ur: any) =>
            ur.role.rolePermissions.map((rp: any) => rp.permission.name)
        );

        // Generate tokens
        const tokens = await tokenService.generateTokenPair(
            user.id,
            user.email,
            roles,
            [...new Set(permissions)] as string[],
            deviceInfo
        );

        return {
            user: this.sanitizeUser(user, roles, permissions),
            tokens,
        };
    }

    private async getGoogleUser(_code: string) {
        // This is a simplified implementation. In production, use official libraries or proper fetch calls.
        // 1. Exchange code for access_token
        // 2. Fetch user info from https://www.googleapis.com/oauth2/v2/userinfo
        logger.debug('Exchanging Google code');

        // Placeholder fetching logic (Mocking for now as we don't have real credentials)
        // In a real implementation, you'd use fetch() to talk to Google's API.
        return {
            id: `google_${Date.now()}`,
            email: 'oauth_user@example.com',
            firstName: 'Google',
            lastName: 'User',
        };
    }

    private async getGitHubUser(_code: string) {
        logger.debug('Exchanging GitHub code');
        return {
            id: `github_${Date.now()}`,
            email: 'gh_user@example.com',
            firstName: 'GitHub',
            lastName: 'User',
        };
    }

    private sanitizeUser(user: any, roles: string[], permissions: string[]): SafeUser {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive,
            isVerified: user.isVerified,
            emailVerifiedAt: user.emailVerifiedAt,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            roles,
            permissions: [...new Set(permissions)],
        };
    }
}

export const oauthService = new OAuthService();
