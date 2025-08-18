"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProjectSchema = new mongoose_1.Schema({
    tenantId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    customerId: { type: mongoose_1.Schema.Types.ObjectId },
    name: { type: String, required: true },
    status: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String },
    },
});
ProjectSchema.index({ tenantId: 1, name: 1 });
exports.default = (0, mongoose_1.model)('Project', ProjectSchema);
