"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const index_js_1 = require("./config/index.js");
const connection_js_1 = require("./database/connection.js");
const logger_js_1 = require("./utils/logger.js");
const logger = (0, logger_js_1.createLogger)('server');
/**
 * Start the server
 */
async function start() {
    try {
        // Connect to database
        await (0, connection_js_1.connectDatabase)();
        // Create Express app
        const app = (0, app_js_1.createApp)();
        // Start HTTP server
        const server = app.listen(index_js_1.config.app.port, () => {
            logger.info({
                port: index_js_1.config.app.port,
                env: index_js_1.config.app.env,
                apiPrefix: index_js_1.config.app.apiPrefix,
            }, `🚀 Server started on port ${index_js_1.config.app.port}`);
            logger.info(`📚 API Documentation: http://localhost:${index_js_1.config.app.port}/api-docs`);
        });
        // Graceful shutdown
        const shutdown = async (signal) => {
            logger.info({ signal }, 'Received shutdown signal');
            server.close(async () => {
                logger.info('HTTP server closed');
                await (0, connection_js_1.disconnectDatabase)();
                process.exit(0);
            });
            // Force exit after 10 seconds
            setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            logger.fatal({ error }, 'Uncaught exception');
            process.exit(1);
        });
        process.on('unhandledRejection', (reason) => {
            logger.fatal({ reason }, 'Unhandled rejection');
            process.exit(1);
        });
    }
    catch (error) {
        logger.fatal({ error }, 'Failed to start server');
        process.exit(1);
    }
}
// Start the server
start();
//# sourceMappingURL=server.js.map