import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Environment variable helper with type safety
 */
function getEnv(key: string, defaultValue?: string): string {
    const value = process.env[key] ?? defaultValue;
    if (value === undefined) {
        throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
}

function getEnvNumber(key: string, defaultValue?: number): number {
    const value = process.env[key];
    if (value === undefined) {
        if (defaultValue === undefined) {
            throw new Error(`Environment variable ${key} is not defined`);
        }
        return defaultValue;
    }
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
        throw new Error(`Environment variable ${key} must be a number`);
    }
    return parsed;
}

/**
 * Application Configuration
 */
export const config = {
    // Application
    app: {
        name: getEnv('APP_NAME', 'Universal Auth Backend'),
        env: getEnv('NODE_ENV', 'development'),
        port: getEnvNumber('PORT', 3000),
        apiPrefix: getEnv('API_PREFIX', '/api/v1'),
        isDev: getEnv('NODE_ENV', 'development') === 'development',
        isProd: getEnv('NODE_ENV', 'development') === 'production',
    },

    // Database
    database: {
        url: getEnv('DATABASE_URL'),
    },

    // JWT
    jwt: {
        secret: getEnv('JWT_SECRET'),
        accessExpiration: getEnv('JWT_ACCESS_EXPIRATION', '15m'),
        refreshExpiration: getEnv('JWT_REFRESH_EXPIRATION', '7d'),
        issuer: getEnv('JWT_ISSUER', 'universal-auth-backend'),
    },

    // Password Hashing (Argon2)
    argon2: {
        memoryCost: getEnvNumber('ARGON2_MEMORY_COST', 65536),
        timeCost: getEnvNumber('ARGON2_TIME_COST', 3),
        parallelism: getEnvNumber('ARGON2_PARALLELISM', 4),
    },

    // Rate Limiting
    rateLimit: {
        windowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 900000), // 15 minutes
        maxRequests: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),
        authWindowMs: getEnvNumber('AUTH_RATE_LIMIT_WINDOW_MS', 900000),
        authMaxRequests: getEnvNumber('AUTH_RATE_LIMIT_MAX_REQUESTS', 5),
    },

    // Brute Force Protection
    bruteForce: {
        maxLoginAttempts: getEnvNumber('MAX_LOGIN_ATTEMPTS', 10),
        lockoutDurationMs: getEnvNumber('LOGIN_LOCKOUT_DURATION_MS', 1800000), // 30 minutes
    },

    // CORS
    cors: {
        origins: getEnv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(','),
    },

    // Logging
    logging: {
        level: getEnv('LOG_LEVEL', 'info'),
    },
} as const;

export type Config = typeof config;
