"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const VariationSchema = new mongoose_1.Schema({
    tenantId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    projectId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    proposalId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
    items: [
        {
            description: { type: String, required: true },
            qty: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
});
VariationSchema.index({ tenantId: 1, projectId: 1 });
VariationSchema.index({ tenantId: 1, proposalId: 1 });
exports.default = (0, mongoose_1.model)('Variation', VariationSchema);
