import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../config/index.js';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: config.app.name,
            version: '1.0.0',
            description: 'Production-ready Universal Authentication Backend API documentation',
        },
        servers: [
            {
                url: `http://localhost:${config.app.port}${config.app.apiPrefix}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
