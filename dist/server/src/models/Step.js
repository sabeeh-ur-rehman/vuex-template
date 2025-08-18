"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StepSchema = new mongoose_1.Schema({
    tenantId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    projectId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    description: { type: String },
    order: { type: Number },
    status: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
});
StepSchema.index({ tenantId: 1, projectId: 1, order: 1 });
exports.default = (0, mongoose_1.model)('Step', StepSchema);
