"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signTenantToken = signTenantToken;
exports.verifyTenantToken = verifyTenantToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const secret = env_1.default.jwtSecret || 'secret';
function signTenantToken(tenantId, userId, expiresIn = '1h') {
    return jsonwebtoken_1.default.sign({ tenantId }, secret, { subject: userId, expiresIn });
}
function verifyTenantToken(token) {
    return jsonwebtoken_1.default.verify(token, secret);
}
