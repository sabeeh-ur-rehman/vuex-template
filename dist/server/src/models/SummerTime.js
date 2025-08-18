"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SummerTimeSchema = new mongoose_1.Schema({
    tenantId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    year: { type: Number, required: true },
});
SummerTimeSchema.index({ tenantId: 1, year: 1 });
exports.default = (0, mongoose_1.model)('SummerTime', SummerTimeSchema);
