import { Request, Response } from 'express';
import { oauthService } from '../services/oauth.service.js';
import { ResponseHelper } from '../utils/response.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { config } from '../config/index.js';

/**
 * Get device info from request
 */
function getDeviceInfo(req: Request) {
    return {
        userAgent: req.headers['user-agent'],
        ipAddress: (req.ip || req.socket.remoteAddress) as string,
    };
}

/**
 * OAuth Controller
 * Handles OAuth redirects and callbacks
 */
export const oauthController = {
    /**
     * GET /auth/:provider
     * Redirect to OAuth provider
     */
    redirect: asyncHandler(async (req: Request, res: Response) => {
        const { provider } = req.params;
        let url = '';

        if (provider === 'google') {
            url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.social.google.clientId}&redirect_uri=${config.social.callbackUrl}&response_type=code&scope=email%20profile`;
        } else if (provider === 'github') {
            url = `https://github.com/login/oauth/authorize?client_id=${config.social.github.clientId}&redirect_uri=${config.social.callbackUrl}&scope=user:email`;
        }

        return res.redirect(url);
    }),

    /**
     * POST /auth/:provider/callback
     * Handle provider callback, exchange code for user info and log in
     */
    callback: asyncHandler(async (req: Request, res: Response) => {
        const { provider } = req.params as { provider: 'google' | 'github' };
        const { code } = req.body;

        const result = await oauthService.handleOAuthCallback(provider, code, getDeviceInfo(req));

        return ResponseHelper.success(res, result);
    }),
};
