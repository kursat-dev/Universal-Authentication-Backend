/**
 * Password Service
 * Handles password hashing and verification using Argon2id
 */
export declare class PasswordService {
    private readonly options;
    /**
     * Hash a plain password
     */
    hash(password: string): Promise<string>;
    /**
     * Verify a password against a hash
     */
    verify(hash: string, password: string): Promise<boolean>;
    /**
     * Check if a hash needs to be rehashed (e.g., if config changed)
     */
    needsRehash(hash: string): Promise<boolean>;
}
export declare const passwordService: PasswordService;
//# sourceMappingURL=password.service.d.ts.map