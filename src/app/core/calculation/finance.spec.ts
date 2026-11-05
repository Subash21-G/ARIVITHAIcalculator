import { calculateDiscount, calculateGst } from './finance';

describe('GST calculations', () => {
  it.each([
    ['1000', '0', '1000.00', '0.00', '1000.00'],
    ['1000', '5', '1000.00', '50.00', '1050.00'],
    ['1000', '12', '1000.00', '120.00', '1120.00'],
    ['1000', '18', '1000.00', '180.00', '1180.00'],
    ['1000', '7.5', '1000.00', '75.00', '1075.00'],
  ])('adds %s at %s%%', (amount, rate, base, tax, total) => {
    expect(calculateGst(amount, rate, 'exclusive')).toEqual({ base, tax, total });
  });
  it.each([
    ['1000', '0', '1000.00', '0.00'],
    ['1050', '5', '1000.00', '50.00'],
    ['1120', '12', '1000.00', '120.00'],
    ['1180', '18', '1000.00', '180.00'],
    ['1075', '7.5', '1000.00', '75.00'],
  ])('removes %s inclusive of %s%%', (amount, rate, base, tax) => {
    expect(calculateGst(amount, rate, 'inclusive')).toEqual({ base, tax, total: Number(amount).toFixed(2) });
  });
  it.each([['', '18'], ['-1', '18'], ['100', '-1'], ['100', '101'], ['abc', '18'], ['1..2', '18']])('rejects invalid GST %s at %s', (amount, rate) => {
    expect(() => calculateGst(amount, rate, 'exclusive')).toThrow();
  });
});

describe('discount calculations', () => {
  it.each([
    ['2000', '20', 'percent', '400.00', '1600.00'],
    ['2000', '0', 'percent', '0.00', '2000.00'],
    ['2000', '100', 'percent', '2000.00', '0.00'],
    ['2000', '250', 'fixed', '250.00', '1750.00'],
    ['2000', '2000', 'fixed', '2000.00', '0.00'],
  ] as const)('discounts %s by %s %s', (price, value, type, savings, final) => {
    expect(calculateDiscount(price, value, type)).toEqual({ original: Number(price).toFixed(2), savings, final });
  });
  it.each([['-1', '10', 'percent'], ['100', '-1', 'percent'], ['100', '101', 'percent'], ['100', '101', 'fixed'], ['x', '10', 'fixed']] as const)('rejects invalid discount', (price, value, type) => {
    expect(() => calculateDiscount(price, value, type)).toThrow();
  });
});
