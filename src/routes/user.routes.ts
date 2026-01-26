import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission, requireSelfOrAdmin } from '../middleware/rbac.middleware.js';
import {
    createUserSchema,
    getUserSchema,
    updateUserSchema,
    updateProfileSchema,
    assignRoleSchema,
    removeRoleSchema,
} from '../schemas/user.schema.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 */
router.get('/me', userController.getMe);

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Users]
 */
router.patch('/me', validate(updateProfileSchema), userController.updateMe);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 */
router.get('/', requirePermission('user:read'), userController.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 */
router.get('/:id', validate(getUserSchema), requireSelfOrAdmin(), userController.getById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 */
router.post('/', requirePermission('user:create'), validate(createUserSchema), userController.create);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user
 *     tags: [Users]
 */
router.patch('/:id', validate(updateUserSchema), requireSelfOrAdmin(), userController.update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 */
router.delete('/:id', requirePermission('user:delete'), validate(getUserSchema), userController.delete);

/**
 * @swagger
 * /users/{id}/roles:
 *   post:
 *     summary: Assign role to user
 *     tags: [Users]
 */
router.post('/:id/roles', requirePermission('user:update'), validate(assignRoleSchema), userController.assignRole);

/**
 * @swagger
 * /users/{id}/roles/{roleId}:
 *   delete:
 *     summary: Remove role from user
 *     tags: [Users]
 */
router.delete('/:id/roles/:roleId', requirePermission('user:update'), validate(removeRoleSchema), userController.removeRole);

export default router;
