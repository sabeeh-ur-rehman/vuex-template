"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CustomerSchema = new mongoose_1.Schema({
    tenantId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    email: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String },
    },
});
CustomerSchema.index({ tenantId: 1, email: 1 });
exports.default = (0, mongoose_1.model)('Customer', CustomerSchema);
