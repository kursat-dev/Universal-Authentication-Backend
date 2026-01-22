"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = require("../controllers/auth.controller.js");
const validate_middleware_js_1 = require("../middleware/validate.middleware.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const rate_limit_middleware_js_1 = require("../middleware/rate-limit.middleware.js");
const auth_schema_js_1 = require("../schemas/auth.schema.js");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post('/register', rate_limit_middleware_js_1.authRateLimiter, (0, validate_middleware_js_1.validate)(auth_schema_js_1.registerSchema), auth_controller_js_1.authController.register);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many attempts
 */
router.post('/login', rate_limit_middleware_js_1.authRateLimiter, (0, validate_middleware_js_1.validate)(auth_schema_js_1.loginSchema), auth_controller_js_1.authController.login);
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens refreshed
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh', (0, validate_middleware_js_1.validate)(auth_schema_js_1.refreshTokenSchema), auth_controller_js_1.authController.refresh);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout current session
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', (0, validate_middleware_js_1.validate)(auth_schema_js_1.refreshTokenSchema), auth_controller_js_1.authController.logout);
/**
 * @swagger
 * /auth/logout-all:
 *   post:
 *     summary: Logout from all devices
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out from all devices
 *       401:
 *         description: Not authenticated
 */
router.post('/logout-all', auth_middleware_js_1.authenticate, auth_controller_js_1.authController.logoutAll);
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Reset email sent if account exists
 */
router.post('/forgot-password', rate_limit_middleware_js_1.strictRateLimiter, (0, validate_middleware_js_1.validate)(auth_schema_js_1.forgotPasswordSchema), auth_controller_js_1.authController.forgotPassword);
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       404:
 *         description: Invalid or expired token
 */
router.post('/reset-password', rate_limit_middleware_js_1.strictRateLimiter, (0, validate_middleware_js_1.validate)(auth_schema_js_1.resetPasswordSchema), auth_controller_js_1.authController.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map