"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const index_js_1 = require("./config/index.js");
const logger_js_1 = require("./utils/logger.js");
const error_middleware_js_1 = require("./middleware/error.middleware.js");
const rate_limit_middleware_js_1 = require("./middleware/rate-limit.middleware.js");
const index_js_2 = __importDefault(require("./routes/index.js"));
const swagger_js_1 = require("./docs/swagger.js");
const logger = (0, logger_js_1.createLogger)('app');
/**
 * Create and configure Express application
 */
function createApp() {
    const app = (0, express_1.default)();
    // Security headers
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: index_js_1.config.app.isProd,
    }));
    // CORS
    app.use((0, cors_1.default)({
        origin: index_js_1.config.cors.origins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    // Body parsing
    app.use(express_1.default.json({ limit: '10kb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
    // Rate limiting
    app.use(rate_limit_middleware_js_1.generalRateLimiter);
    // Request logging
    app.use((req, _res, next) => {
        logger.info({ method: req.method, path: req.path }, 'Incoming request');
        next();
    });
    // Health check endpoints
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    app.get('/health/ready', (_req, res) => {
        // In production, check database connectivity here
        res.json({ status: 'ready', timestamp: new Date().toISOString() });
    });
    // Swagger documentation
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_js_1.swaggerSpec));
    app.get('/api-docs.json', (_req, res) => {
        res.json(swagger_js_1.swaggerSpec);
    });
    // API routes
    app.use(index_js_1.config.app.apiPrefix, index_js_2.default);
    // 404 handler
    app.use(error_middleware_js_1.notFoundHandler);
    // Error handler (must be last)
    app.use(error_middleware_js_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map