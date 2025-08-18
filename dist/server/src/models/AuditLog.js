"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AuditLogSchema = new mongoose_1.Schema({
    tenantId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, required: true },
});
AuditLogSchema.index({ tenantId: 1, createdAt: 1 });
exports.default = (0, mongoose_1.model)('AuditLog', AuditLogSchema);
