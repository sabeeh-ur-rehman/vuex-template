"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EmailMsgSchema = new mongoose_1.Schema({
    tenantId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    messageId: { type: String, required: true },
});
EmailMsgSchema.index({ tenantId: 1, messageId: 1 });
exports.default = (0, mongoose_1.model)('EmailMsg', EmailMsgSchema);
