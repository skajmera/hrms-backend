export declare const config: {
    port: string | number;
    nodeEnv: string;
    mongoUri: string;
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    email: {
        host: string | undefined;
        port: number;
        user: string | undefined;
        pass: string | undefined;
        from: string;
    };
    upload: {
        maxFileSize: number;
        uploadPath: string;
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    cors: {
        origin: string;
    };
};
//# sourceMappingURL=env.d.ts.map