import { describe, it, expect } from 'vitest';
import {
  baseTotal,
  optionsTotal,
  applyAdjustments,
  calculatePricing,
  LineItem,
  Adjustment,
} from '../src/services/pricing.service';

describe('pricing service', () => {
  it('calculates base and options totals', () => {
    const baseItems: LineItem[] = [
      { price: 100 },
      { price: 50, quantity: 2 },
    ];
    const optionItems: LineItem[] = [
      { price: 25, quantity: 3 },
    ];

    expect(baseTotal(baseItems)).toBe(200);
    expect(optionsTotal(optionItems)).toBe(75);
  });

  it('applies fixed and percentage adjustments', () => {
    const items: LineItem[] = [{ price: 100 }];
    const adjustments: Adjustment[] = [
      { type: 'percent', value: 10 }, // +10%
      { type: 'fixed', value: -5 },   // -5
    ];

    const { total } = calculatePricing(items, [], adjustments);
    expect(total).toBeCloseTo(105); // 100 -> 110 -> 105
  });
});
