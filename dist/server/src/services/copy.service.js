"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyDocument = copyDocument;
/**
 * Duplicate a document by id optionally overriding fields.
 */
async function copyDocument(model, id, overrides = {}) {
    const doc = await model.findById(id).lean();
    if (!doc)
        return null;
    const { _id, ...rest } = doc;
    const created = await model.create({ ...rest, ...overrides });
    return created.toObject();
}
