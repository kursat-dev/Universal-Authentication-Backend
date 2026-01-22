"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_controller_js_1 = require("../controllers/role.controller.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const rbac_middleware_js_1 = require("../middleware/rbac.middleware.js");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_js_1.authenticate);
/**
 * @swagger
 * /roles:
 *   get:
 *     summary: List all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 */
router.get('/', (0, rbac_middleware_js_1.requirePermission)('role:read'), role_controller_js_1.roleController.getAll);
/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Get role by ID with permissions
 *     tags: [Roles]
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
 *         description: Role with permissions
 */
router.get('/:id', (0, rbac_middleware_js_1.requirePermission)('role:read'), role_controller_js_1.roleController.getById);
/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       201:
 *         description: Role created
 */
router.post('/', (0, rbac_middleware_js_1.requirePermission)('role:create'), role_controller_js_1.roleController.create);
/**
 * @swagger
 * /roles/{id}:
 *   patch:
 *     summary: Update a role
 *     tags: [Roles]
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
 *         description: Role updated
 */
router.patch('/:id', (0, rbac_middleware_js_1.requirePermission)('role:update'), role_controller_js_1.roleController.update);
/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
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
 *         description: Role deleted
 */
router.delete('/:id', (0, rbac_middleware_js_1.requirePermission)('role:delete'), role_controller_js_1.roleController.delete);
/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: List all permissions
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of permissions
 */
router.get('/permissions', (0, rbac_middleware_js_1.requirePermission)('role:read'), role_controller_js_1.roleController.getAllPermissions);
/**
 * @swagger
 * /roles/{id}/permissions:
 *   post:
 *     summary: Assign permission to role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permission assigned
 */
router.post('/:id/permissions', (0, rbac_middleware_js_1.requirePermission)('role:update'), role_controller_js_1.roleController.assignPermission);
/**
 * @swagger
 * /roles/{id}/permissions/{permissionId}:
 *   delete:
 *     summary: Remove permission from role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Permission removed
 */
router.delete('/:id/permissions/:permissionId', (0, rbac_middleware_js_1.requirePermission)('role:update'), role_controller_js_1.roleController.removePermission);
exports.default = router;
//# sourceMappingURL=role.routes.js.map