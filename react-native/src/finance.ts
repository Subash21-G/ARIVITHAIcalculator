import Decimal from 'decimal.js';
import { CalculationError } from './engine';

const MoneyDecimal = Decimal.clone({ precision: 50, rounding: Decimal.ROUND_HALF_UP });

function nonnegative(value: string, label: string): Decimal {
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(value.trim())) throw new CalculationError(`Enter a valid ${label}`);
  const amount = new MoneyDecimal(value.trim());
  if (!amount.isFinite() || amount.isNegative()) throw new CalculationError(`${label} must be zero or greater`);
  return amount;
}

function money(value: Decimal): string { return value.toDecimalPlaces(2).toFixed(2); }

export type GstResult = { base: string; tax: string; total: string };
export type DiscountResult = { original: string; savings: string; final: string };

export function calculateGst(amountText: string, rateText: string, mode: 'exclusive' | 'inclusive'): GstResult {
  const amount = nonnegative(amountText, 'amount');
  const rate = nonnegative(rateText, 'GST rate');
  if (rate.gt(100)) throw new CalculationError('GST rate must be 100% or less');
  if (mode !== 'exclusive' && mode !== 'inclusive') throw new CalculationError('Invalid GST mode');
  const factor = rate.div(100);
  const base = mode === 'exclusive' ? amount : amount.div(new MoneyDecimal(1).add(factor));
  const total = mode === 'exclusive' ? amount.add(amount.mul(factor)) : amount;
  return { base: money(base), tax: money(total.sub(base)), total: money(total) };
}

export function calculateDiscount(priceText: string, valueText: string, type: 'percent' | 'fixed'): DiscountResult {
  const price = nonnegative(priceText, 'original price');
  const value = nonnegative(valueText, 'discount');
  if (type !== 'percent' && type !== 'fixed') throw new CalculationError('Invalid discount type');
  if (type === 'percent' && value.gt(100)) throw new CalculationError('Discount percent must be 100% or less');
  const savings = type === 'percent' ? price.mul(value).div(100) : value;
  if (savings.gt(price)) throw new CalculationError('Discount cannot exceed the original price');
  return { original: money(price), savings: money(savings), final: money(price.sub(savings)) };
}
