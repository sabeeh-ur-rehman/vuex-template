"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StandardStepSchema = new mongoose_1.Schema({
    tenantId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
});
StandardStepSchema.index({ tenantId: 1, name: 1 });
exports.default = (0, mongoose_1.model)('StandardStep', StandardStepSchema);
