"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PriceListSchema = new mongoose_1.Schema({
    tenantId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    description: { type: String },
    items: [
        {
            name: { type: String, required: true },
            unit: { type: String },
            price: { type: Number, required: true },
            description: { type: String },
        },
    ],
});
PriceListSchema.index({ tenantId: 1, name: 1 });
exports.default = (0, mongoose_1.model)('PriceList', PriceListSchema);
