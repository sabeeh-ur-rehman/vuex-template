"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const pricing_service_1 = require("../src/services/pricing.service");
(0, vitest_1.describe)('pricing service', () => {
    (0, vitest_1.it)('calculates base and options totals', () => {
        const baseItems = [
            { price: 100 },
            { price: 50, quantity: 2 },
        ];
        const optionItems = [
            { price: 25, quantity: 3 },
        ];
        (0, vitest_1.expect)((0, pricing_service_1.baseTotal)(baseItems)).toBe(200);
        (0, vitest_1.expect)((0, pricing_service_1.optionsTotal)(optionItems)).toBe(75);
    });
    (0, vitest_1.it)('applies fixed and percentage adjustments', () => {
        const items = [{ price: 100 }];
        const adjustments = [
            { type: 'percent', value: 10 }, // +10%
            { type: 'fixed', value: -5 }, // -5
        ];
        const { total } = (0, pricing_service_1.calculatePricing)(items, [], adjustments);
        (0, vitest_1.expect)(total).toBeCloseTo(105); // 100 -> 110 -> 105
    });
});
