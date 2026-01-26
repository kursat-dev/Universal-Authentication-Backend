import { PrismaClient } from '@prisma/client';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('database');

/**
 * Prisma Client Singleton
 * Ensures only one connection pool is created
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
    });

// Prevent multiple instances in development (hot reload)
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

/**
 * Connect to database
 */
export async function connectDatabase() {
    try {
        await prisma.$connect();
        logger.info('Connected to database');
    } catch (error) {
        logger.error({ error }, 'Failed to connect to database');
        throw error;
    }
}

/**
 * Disconnect from database
 */
export async function disconnectDatabase() {
    await prisma.$disconnect();
    logger.info('Disconnected from database');
}

export { PrismaClient };
