"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClient = exports.prisma = void 0;
exports.connectDatabase = connectDatabase;
exports.disconnectDatabase = disconnectDatabase;
const client_1 = require("@prisma/client");
Object.defineProperty(exports, "PrismaClient", { enumerable: true, get: function () { return client_1.PrismaClient; } });
const logger_js_1 = require("../utils/logger.js");
const logger = (0, logger_js_1.createLogger)('database');
/**
 * Prisma Client Singleton
 * Ensures only one connection pool is created
 */
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ??
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
    });
// Prevent multiple instances in development (hot reload)
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
/**
 * Connect to database
 */
async function connectDatabase() {
    try {
        await exports.prisma.$connect();
        logger.info('Connected to database');
    }
    catch (error) {
        logger.error({ error }, 'Failed to connect to database');
        throw error;
    }
}
/**
 * Disconnect from database
 */
async function disconnectDatabase() {
    await exports.prisma.$disconnect();
    logger.info('Disconnected from database');
}
//# sourceMappingURL=connection.js.map