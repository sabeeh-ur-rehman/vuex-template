"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProposalSchema = new mongoose_1.Schema({
    tenantId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    projectId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    customerId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    priceListId: { type: mongoose_1.Schema.Types.ObjectId },
    notes: { type: String },
    sections: [
        {
            id: { type: Number, required: true },
            title: { type: String, required: true },
            complete: { type: Boolean, required: true },
            items: [
                {
                    id: { type: Number, required: true },
                    name: { type: String, required: true },
                    qty: { type: Number, required: true },
                    price: { type: Number, required: true },
                    optional: { type: Boolean },
                    selected: { type: Boolean },
                },
            ],
        },
    ],
    showPrices: { type: Boolean },
    adjustment: { type: Number },
    subtotal: { type: Number },
    total: { type: Number },
});
ProposalSchema.index({ tenantId: 1, projectId: 1 });
exports.default = (0, mongoose_1.model)('Proposal', ProposalSchema);
