"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPriceList = createPriceList;
exports.listPriceLists = listPriceLists;
exports.updatePriceList = updatePriceList;
const PriceList_1 = __importDefault(require("../models/PriceList"));
async function createPriceList(tenantId, name, description, items) {
    const created = await PriceList_1.default.create({ tenantId, name, description, items });
    return created.toObject();
}
async function listPriceLists(tenantId) {
    return PriceList_1.default.find({ tenantId }).lean();
}
async function updatePriceList(id, tenantId, data) {
    return PriceList_1.default.findOneAndUpdate({ _id: id, tenantId }, data, { new: true }).lean();
}
