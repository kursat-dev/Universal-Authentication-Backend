import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import roleRoutes from './role.routes.js';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);

// Permissions route (separate from roles for clarity)
router.use('/permissions', roleRoutes);

// API info
router.get('/', (_req: Request, res: Response) => {
    res.json({
        name: 'Universal Auth Backend API',
        version: '1.0.0',
        documentation: '/api-docs',
    });
});

export default router;
