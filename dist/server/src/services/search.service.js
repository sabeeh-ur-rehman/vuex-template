"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textSearch = textSearch;
/**
 * Generic text search on a Mongoose model using the $text operator.
 */
async function textSearch(model, tenantId, query) {
    const filter = { tenantId, $text: { $search: query } };
    return model.find(filter).lean();
}
