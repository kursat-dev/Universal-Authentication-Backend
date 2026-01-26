import { Router } from 'express';
import authRoutes from './auth.routes.js';
import oauthRoutes from './oauth.routes.js';
import userRoutes from './user.routes.js';
import roleRoutes from './role.routes.js';

const router = Router();

// Auth routes
router.use('/auth', authRoutes);

// OAuth routes
router.use('/auth', oauthRoutes);

// User routes
router.use('/users', userRoutes);

// Role routes
router.use('/roles', roleRoutes);

export default router;
