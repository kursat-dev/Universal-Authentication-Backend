import { Router } from 'express';
import { roleController } from '../controllers/role.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

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
router.get('/', requirePermission('role:read'), roleController.getAll);

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
router.get('/:id', requirePermission('role:read'), roleController.getById);

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
router.post('/', requirePermission('role:create'), roleController.create);

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
router.patch('/:id', requirePermission('role:update'), roleController.update);

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
router.delete('/:id', requirePermission('role:delete'), roleController.delete);

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
router.get('/permissions', requirePermission('role:read'), roleController.getAllPermissions);

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
router.post('/:id/permissions', requirePermission('role:update'), roleController.assignPermission);

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
router.delete(
    '/:id/permissions/:permissionId',
    requirePermission('role:update'),
    roleController.removePermission
);

export default router;
