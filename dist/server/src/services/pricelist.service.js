"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPriceList = createPriceList;
exports.listPriceLists = listPriceLists;
exports.renamePriceList = renamePriceList;
const PriceList_1 = __importDefault(require("../models/PriceList"));
async function createPriceList(tenantId, name) {
    const created = await PriceList_1.default.create({ tenantId, name });
    return created.toObject();
}
async function listPriceLists(tenantId) {
    return PriceList_1.default.find({ tenantId }).lean();
}
async function renamePriceList(id, tenantId, name) {
    return PriceList_1.default.findOneAndUpdate({ _id: id, tenantId }, { name }, { new: true }).lean();
}
