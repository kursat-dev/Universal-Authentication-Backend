import { Router } from 'express';
import { oauthController } from '../controllers/oauth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { oauthCallbackSchema } from '../schemas/auth.schema.js';
import { authRateLimiter } from '../middleware/rate-limit.middleware.js';

const router = Router();

/**
 * @swagger
 * /auth/{provider}:
 *   get:
 *     summary: Redirect to OAuth provider
 *     tags: [OAuth]
 *     parameters:
 *       - in: path
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *           enum: [google, github]
 */
router.get('/:provider', oauthController.redirect);

/**
 * @swagger
 * /auth/{provider}/callback:
 *   post:
 *     summary: Handle OAuth callback
 *     tags: [OAuth]
 *     parameters:
 *       - in: path
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *           enum: [google, github]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code]
 *             properties:
 *               code:
 *                 type: string
 */
router.post('/:provider/callback', authRateLimiter, validate(oauthCallbackSchema), oauthController.callback);

export default router;
