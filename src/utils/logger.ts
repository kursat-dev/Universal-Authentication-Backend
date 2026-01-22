import pino from 'pino';
import { config } from '../config/index.js';

/**
 * Structured Logger using Pino
 * - Fast JSON logging in production
 * - Pretty printing in development
 */
export const logger = pino({
    level: config.logging.level,
    transport: config.app.isDev
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
            },
        }
        : undefined,
    base: {
        env: config.app.env,
        app: config.app.name,
    },
    formatters: {
        level: (label) => ({ level: label }),
    },
    timestamp: pino.stdTimeFunctions.isoTime,
});

/**
 * Child logger factory for creating component-specific loggers
 */
export function createLogger(component: string): pino.Logger {
    return logger.child({ component });
}

export type Logger = pino.Logger;
