export interface TokenPayload {
    id: string;
    email: string;
    role: string;
}
/**
 * Generate access token
 */
export declare const generateAccessToken: (payload: TokenPayload) => string;
/**
 * Generate refresh token
 */
export declare const generateRefreshToken: (payload: TokenPayload) => string;
/**
 * Verify access token
 */
export declare const verifyAccessToken: (token: string) => TokenPayload;
/**
 * Verify refresh token
 */
export declare const verifyRefreshToken: (token: string) => TokenPayload;
/**
 * Decode token without verification
 */
export declare const decodeToken: (token: string) => any;
//# sourceMappingURL=jwt.d.ts.map