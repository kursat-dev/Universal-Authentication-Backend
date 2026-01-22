"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.createLogger = createLogger;
const pino_1 = __importDefault(require("pino"));
const index_js_1 = require("../config/index.js");
/**
 * Structured Logger using Pino
 * - Fast JSON logging in production
 * - Pretty printing in development
 */
exports.logger = (0, pino_1.default)({
    level: index_js_1.config.logging.level,
    transport: index_js_1.config.app.isDev
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
        env: index_js_1.config.app.env,
        app: index_js_1.config.app.name,
    },
    formatters: {
        level: (label) => ({ level: label }),
    },
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
});
/**
 * Child logger factory for creating component-specific loggers
 */
function createLogger(component) {
    return exports.logger.child({ component });
}
//# sourceMappingURL=logger.js.map