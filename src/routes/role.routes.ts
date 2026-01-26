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
 */
router.get('/', requirePermission('role:read'), roleController.getAll);

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Get role by ID with permissions
 *     tags: [Roles]
 */
router.get('/:id', requirePermission('role:read'), roleController.getById);

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 */
router.post('/', requirePermission('role:create'), roleController.create);

/**
 * @swagger
 * /roles/{id}:
 *   patch:
 *     summary: Update a role
 *     tags: [Roles]
 */
router.patch('/:id', requirePermission('role:update'), roleController.update);

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
 */
router.delete('/:id', requirePermission('role:delete'), roleController.delete);

/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: List all permissions
 *     tags: [Roles]
 */
router.get('/permissions', requirePermission('role:read'), roleController.getAllPermissions);

/**
 * @swagger
 * /roles/{id}/permissions:
 *   post:
 *     summary: Assign permission to role
 *     tags: [Roles]
 */
router.post('/:id/permissions', requirePermission('role:update'), roleController.assignPermission);

/**
 * @swagger
 * /roles/{id}/permissions/{permissionId}:
 *   delete:
 *     summary: Remove permission from role
 *     tags: [Roles]
 */
router.delete('/:id/permissions/:permissionId', requirePermission('role:update'), roleController.removePermission);

export default router;
