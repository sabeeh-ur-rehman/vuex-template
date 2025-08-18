"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MembershipSchema = new mongoose_1.Schema({
    tenantId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    role: { type: String, required: true, enum: ['admin', 'member'] },
});
MembershipSchema.index({ tenantId: 1, userId: 1 });
exports.default = (0, mongoose_1.model)('Membership', MembershipSchema);
