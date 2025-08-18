"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DocumentSchema = new mongoose_1.Schema({
    tenantId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
});
DocumentSchema.index({ tenantId: 1, title: 1 });
exports.default = (0, mongoose_1.model)('Document', DocumentSchema);
