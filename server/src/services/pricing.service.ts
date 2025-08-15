export interface LineItem {
  price: number;
  quantity?: number;
}

export interface Adjustment {
  /** 'fixed' adds/subtracts raw amount, 'percent' adjusts by percentage */
  type: 'fixed' | 'percent';
  value: number;
}

/** Sum price * quantity for base items */
export function baseTotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);
}

/** Sum price * quantity for option items */
export function optionsTotal(items: LineItem[]): number {
  return baseTotal(items);
}

/** Apply adjustments to total */
export function applyAdjustments(total: number, adjustments: Adjustment[] = []): number {
  return adjustments.reduce((acc, adj) => {
    if (adj.type === 'percent') {
      return acc + acc * (adj.value / 100);
    }
    return acc + adj.value;
  }, total);
}

export interface PricingBreakdown {
  base: number;
  options: number;
  total: number;
}

/**
 * Calculate total price from base and option items with adjustments.
 */
export function calculatePricing(
  baseItems: LineItem[],
  optionItems: LineItem[] = [],
  adjustments: Adjustment[] = []
): PricingBreakdown {
  const base = baseTotal(baseItems);
  const options = optionsTotal(optionItems);
  const total = applyAdjustments(base + options, adjustments);
  return { base, options, total };
}
