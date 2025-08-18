"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guard = guard;
const Membership_1 = __importDefault(require("../models/Membership"));
const jwt_1 = require("./jwt");
const rbac_1 = require("../utils/rbac");
function guard(resource, action) {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const payload = (0, jwt_1.verifyTenantToken)(token);
            req.userId = payload.sub;
            req.tenantId = payload.tenantId;
            const membership = await Membership_1.default.findOne({
                tenantId: payload.tenantId,
                userId: payload.sub
            }).lean();
            if (!membership) {
                return res.status(403).json({ message: 'Membership required' });
            }
            req.membership = membership;
            if (!(0, rbac_1.can)(membership.role, action, resource)) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            next();
        }
        catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
}
