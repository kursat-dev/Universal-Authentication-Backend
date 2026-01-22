"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_js_1 = __importDefault(require("./auth.routes.js"));
const user_routes_js_1 = __importDefault(require("./user.routes.js"));
const role_routes_js_1 = __importDefault(require("./role.routes.js"));
const router = (0, express_1.Router)();
// API routes
router.use('/auth', auth_routes_js_1.default);
router.use('/users', user_routes_js_1.default);
router.use('/roles', role_routes_js_1.default);
// Permissions route (separate from roles for clarity)
router.use('/permissions', role_routes_js_1.default);
// API info
router.get('/', (_req, res) => {
    res.json({
        name: 'Universal Auth Backend API',
        version: '1.0.0',
        documentation: '/api-docs',
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map