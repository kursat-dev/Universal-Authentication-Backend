import { createApp } from './app.js';
import { config } from './config/index.js';
import { connectDatabase, disconnectDatabase } from './database/connection.js';
import { createLogger } from './utils/logger.js';

const logger = createLogger('server');

/**
 * Start the server
 */
async function start() {
    try {
        // Connect to database
        await connectDatabase();

        // Create Express app
        const app = createApp();

        // Start HTTP server
        const server = app.listen(config.app.port, () => {
            logger.info(
                {
                    port: config.app.port,
                    env: config.app.env,
                    apiPrefix: config.app.apiPrefix,
                },
                `🚀 Server started on port ${config.app.port}`
            );
            logger.info(`📚 API Documentation: http://localhost:${config.app.port}/api-docs`);
        });

        // Graceful shutdown
        const shutdown = async (signal: string) => {
            logger.info({ signal }, 'Received shutdown signal');
            server.close(async () => {
                logger.info('HTTP server closed');
                await disconnectDatabase();
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
    } catch (error) {
        logger.fatal({ error }, 'Failed to start server');
        process.exit(1);
    }
}

// Start the server
start();
