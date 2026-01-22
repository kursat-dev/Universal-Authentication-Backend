import pino from 'pino';
/**
 * Structured Logger using Pino
 * - Fast JSON logging in production
 * - Pretty printing in development
 */
export declare const logger: pino.Logger<never, boolean>;
/**
 * Child logger factory for creating component-specific loggers
 */
export declare function createLogger(component: string): pino.Logger;
export type Logger = pino.Logger;
//# sourceMappingURL=logger.d.ts.map