"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_js_1 = require("../controllers/user.controller.js");
const validate_middleware_js_1 = require("../middleware/validate.middleware.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const rbac_middleware_js_1 = require("../middleware/rbac.middleware.js");
const user_schema_js_1 = require("../schemas/user.schema.js");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_js_1.authenticate);
/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Not authenticated
 */
router.get('/me', user_controller_js_1.userController.getMe);
/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Not authenticated
 */
router.patch('/me', (0, validate_middleware_js_1.validate)(user_schema_js_1.updateProfileSchema), user_controller_js_1.userController.updateMe);
/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Permission denied
 */
router.get('/', (0, rbac_middleware_js_1.requirePermission)('user:read'), user_controller_js_1.userController.getAll);
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 */
router.get('/:id', (0, validate_middleware_js_1.validate)(user_schema_js_1.getUserSchema), (0, rbac_middleware_js_1.requireSelfOrAdmin)(), user_controller_js_1.userController.getById);
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               roleIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       201:
 *         description: User created
 *       403:
 *         description: Permission denied
 */
router.post('/', (0, rbac_middleware_js_1.requirePermission)('user:create'), (0, validate_middleware_js_1.validate)(user_schema_js_1.createUserSchema), user_controller_js_1.userController.create);
/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User updated
 */
router.patch('/:id', (0, validate_middleware_js_1.validate)(user_schema_js_1.updateUserSchema), (0, rbac_middleware_js_1.requireSelfOrAdmin)(), user_controller_js_1.userController.update);
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: User deleted
 */
router.delete('/:id', (0, rbac_middleware_js_1.requirePermission)('user:delete'), (0, validate_middleware_js_1.validate)(user_schema_js_1.getUserSchema), user_controller_js_1.userController.delete);
/**
 * @swagger
 * /users/{id}/roles:
 *   post:
 *     summary: Assign role to user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roleId]
 *             properties:
 *               roleId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Role assigned
 */
router.post('/:id/roles', (0, rbac_middleware_js_1.requirePermission)('user:update'), (0, validate_middleware_js_1.validate)(user_schema_js_1.assignRoleSchema), user_controller_js_1.userController.assignRole);
/**
 * @swagger
 * /users/{id}/roles/{roleId}:
 *   delete:
 *     summary: Remove role from user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Role removed
 */
router.delete('/:id/roles/:roleId', (0, rbac_middleware_js_1.requirePermission)('user:update'), (0, validate_middleware_js_1.validate)(user_schema_js_1.removeRoleSchema), user_controller_js_1.userController.removeRole);
exports.default = router;
//# sourceMappingURL=user.routes.js.map