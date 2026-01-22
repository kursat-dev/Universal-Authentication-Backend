/**
 * Application Configuration
 */
export declare const config: {
    readonly app: {
        readonly name: string;
        readonly env: string;
        readonly port: number;
        readonly apiPrefix: string;
        readonly isDev: boolean;
        readonly isProd: boolean;
    };
    readonly database: {
        readonly url: string;
    };
    readonly jwt: {
        readonly secret: string;
        readonly accessExpiration: string;
        readonly refreshExpiration: string;
        readonly issuer: string;
    };
    readonly argon2: {
        readonly memoryCost: number;
        readonly timeCost: number;
        readonly parallelism: number;
    };
    readonly rateLimit: {
        readonly windowMs: number;
        readonly maxRequests: number;
        readonly authWindowMs: number;
        readonly authMaxRequests: number;
    };
    readonly bruteForce: {
        readonly maxLoginAttempts: number;
        readonly lockoutDurationMs: number;
    };
    readonly cors: {
        readonly origins: string[];
    };
    readonly logging: {
        readonly level: string;
    };
};
export type Config = typeof config;
//# sourceMappingURL=index.d.ts.map