import argon2 from 'argon2';
import { config } from '../config/index.js';

/**
 * Password Service
 * Handles password hashing and verification using Argon2id
 */
export class PasswordService {
    private options = {
        type: argon2.argon2id,
        memoryCost: config.argon2.memoryCost,
        timeCost: config.argon2.timeCost,
        parallelism: config.argon2.parallelism,
    };

    /**
     * Hash a plain password
     */
    async hash(password: string): Promise<string> {
        return argon2.hash(password, this.options);
    }

    /**
     * Verify a password against a hash
     */
    async verify(hash: string, password: string): Promise<boolean> {
        try {
            return await argon2.verify(hash, password);
        } catch {
            return false;
        }
    }

    /**
     * Check if a hash needs to be rehashed (e.g., if config changed)
     */
    async needsRehash(hash: string): Promise<boolean> {
        return argon2.needsRehash(hash, this.options);
    }
}

// Export singleton instance
export const passwordService = new PasswordService();
