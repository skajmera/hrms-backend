"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
/**
 * Generate access token
 */
const generateAccessToken = (payload) => {
    const options = {
        expiresIn: env_1.config.jwt.expiresIn
    };
    return jsonwebtoken_1.default.sign(payload, env_1.config.jwt.secret, options
    //     {
    //     expiresIn: config.jwt.expiresIn
    //   }
    );
};
exports.generateAccessToken = generateAccessToken;
/**
 * Generate refresh token
 */
const generateRefreshToken = (payload) => {
    const options = {
        expiresIn: env_1.config.jwt.refreshExpiresIn
    };
    return jsonwebtoken_1.default.sign(payload, env_1.config.jwt.refreshSecret, options
    //      {
    //     expiresIn: config.jwt.refreshExpiresIn
    //   }
    );
};
exports.generateRefreshToken = generateRefreshToken;
/**
 * Verify access token
 */
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.config.jwt.secret);
};
exports.verifyAccessToken = verifyAccessToken;
/**
 * Verify refresh token
 */
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.config.jwt.refreshSecret);
};
exports.verifyRefreshToken = verifyRefreshToken;
/**
 * Decode token without verification
 */
const decodeToken = (token) => {
    return jsonwebtoken_1.default.decode(token);
};
exports.decodeToken = decodeToken;
//# sourceMappingURL=jwt.js.map