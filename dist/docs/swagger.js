"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const index_js_1 = require("../config/index.js");
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Universal Auth Backend API',
            version: '1.0.0',
            description: `
A production-ready, open-source authentication backend with JWT, RBAC, and PostgreSQL.

## Features
- 🔑 JWT Authentication with Refresh Tokens
- 👥 Role-Based Access Control (RBAC)
- 🛡️ Rate Limiting & Brute Force Protection
- 📧 Password Reset Flow

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <access_token>
\`\`\`
      `,
            contact: {
                name: 'API Support',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        servers: [
            {
                url: `http://localhost:${index_js_1.config.app.port}${index_js_1.config.app.apiPrefix}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your access token',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        error: {
                            type: 'object',
                            properties: {
                                code: { type: 'string', example: 'VALIDATION_ERROR' },
                                message: { type: 'string', example: 'Invalid request data' },
                                details: { type: 'array', items: { type: 'object' } },
                            },
                        },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        email: { type: 'string', format: 'email' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        isActive: { type: 'boolean' },
                        isVerified: { type: 'boolean' },
                        roles: { type: 'array', items: { type: 'string' } },
                        permissions: { type: 'array', items: { type: 'string' } },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                TokenPair: {
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' },
                        expiresIn: { type: 'integer', description: 'Access token lifetime in seconds' },
                    },
                },
                Role: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        isSystem: { type: 'boolean' },
                    },
                },
                Permission: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string', example: 'user:create' },
                        description: { type: 'string' },
                        resource: { type: 'string' },
                        action: { type: 'string' },
                    },
                },
            },
        },
        tags: [
            { name: 'Auth', description: 'Authentication endpoints' },
            { name: 'Users', description: 'User management endpoints' },
            { name: 'Roles', description: 'Role and permission management' },
        ],
    },
    apis: ['./src/routes/*.ts'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map