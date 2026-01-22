import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/index.js';
import { createLogger } from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { generalRateLimiter } from './middleware/rate-limit.middleware.js';
import routes from './routes/index.js';
import { swaggerSpec } from './docs/swagger.js';

const logger = createLogger('app');

/**
 * Create and configure Express application
 */
export function createApp(): Application {
    const app = express();

    // Security headers
    app.use(
        helmet({
            contentSecurityPolicy: config.app.isProd,
        })
    );

    // CORS
    app.use(
        cors({
            origin: config.cors.origins,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        })
    );

    // Body parsing
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));

    // Rate limiting
    app.use(generalRateLimiter);

    // Request logging
    app.use((req: Request, _res: Response, next) => {
        logger.info({ method: req.method, path: req.path }, 'Incoming request');
        next();
    });

    // Health check endpoints
    app.get('/health', (_req: Request, res: Response) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    app.get('/health/ready', (_req: Request, res: Response) => {
        // In production, check database connectivity here
        res.json({ status: 'ready', timestamp: new Date().toISOString() });
    });

    // Swagger documentation
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/api-docs.json', (_req: Request, res: Response) => {
        res.json(swaggerSpec);
    });

    // API routes
    app.use(config.app.apiPrefix, routes);

    // 404 handler
    app.use(notFoundHandler);

    // Error handler (must be last)
    app.use(errorHandler);

    return app;
}
