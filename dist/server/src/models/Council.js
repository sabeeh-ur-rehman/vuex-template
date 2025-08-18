"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CouncilSchema = new mongoose_1.Schema({
    tenantId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
});
CouncilSchema.index({ tenantId: 1, name: 1 });
exports.default = (0, mongoose_1.model)('Council', CouncilSchema);
