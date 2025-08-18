"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RepSchema = new mongoose_1.Schema({
    tenantId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    email: { type: String, required: true },
});
RepSchema.index({ tenantId: 1, email: 1 });
exports.default = (0, mongoose_1.model)('Rep', RepSchema);
