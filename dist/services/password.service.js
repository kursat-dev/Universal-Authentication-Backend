"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordService = exports.PasswordService = void 0;
const argon2_1 = __importDefault(require("argon2"));
const index_js_1 = require("../config/index.js");
/**
 * Password Service
 * Handles password hashing and verification using Argon2id
 */
class PasswordService {
    options = {
        type: argon2_1.default.argon2id,
        memoryCost: index_js_1.config.argon2.memoryCost,
        timeCost: index_js_1.config.argon2.timeCost,
        parallelism: index_js_1.config.argon2.parallelism,
    };
    /**
     * Hash a plain password
     */
    async hash(password) {
        return argon2_1.default.hash(password, this.options);
    }
    /**
     * Verify a password against a hash
     */
    async verify(hash, password) {
        try {
            return await argon2_1.default.verify(hash, password);
        }
        catch {
            return false;
        }
    }
    /**
     * Check if a hash needs to be rehashed (e.g., if config changed)
     */
    async needsRehash(hash) {
        return argon2_1.default.needsRehash(hash, this.options);
    }
}
exports.PasswordService = PasswordService;
// Export singleton instance
exports.passwordService = new PasswordService();
//# sourceMappingURL=password.service.js.map