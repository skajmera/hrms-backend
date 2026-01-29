import jwt from 'jsonwebtoken';
import { config } from '../../config/env';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Generate access token
 */
export const generateAccessToken = (payload: TokenPayload): string => {
    const options: any = {
        expiresIn: config.jwt.expiresIn
      };
  return jwt.sign(payload, config.jwt.secret, 
    options
//     {
//     expiresIn: config.jwt.expiresIn
//   }
);
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
    const options: any = {
        expiresIn: config.jwt.refreshExpiresIn
      };
  return jwt.sign(payload, config.jwt.refreshSecret,
    options
//      {
//     expiresIn: config.jwt.refreshExpiresIn
//   }
);
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwt.secret) as TokenPayload;
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
};

/**
 * Decode token without verification
 */
export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};