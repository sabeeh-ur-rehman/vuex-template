"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseTotal = baseTotal;
exports.optionsTotal = optionsTotal;
exports.applyAdjustments = applyAdjustments;
exports.calculatePricing = calculatePricing;
/** Sum price * quantity for base items */
function baseTotal(items) {
    return items.reduce((sum, item) => { var _a; return sum + item.price * ((_a = item.quantity) !== null && _a !== void 0 ? _a : 1); }, 0);
}
/** Sum price * quantity for option items */
function optionsTotal(items) {
    return baseTotal(items);
}
/** Apply adjustments to total */
function applyAdjustments(total, adjustments = []) {
    return adjustments.reduce((acc, adj) => {
        if (adj.type === 'percent') {
            return acc + acc * (adj.value / 100);
        }
        return acc + adj.value;
    }, total);
}
/**
 * Calculate total price from base and option items with adjustments.
 */
function calculatePricing(baseItems, optionItems = [], adjustments = []) {
    const base = baseTotal(baseItems);
    const options = optionsTotal(optionItems);
    const total = applyAdjustments(base + options, adjustments);
    return { base, options, total };
}
