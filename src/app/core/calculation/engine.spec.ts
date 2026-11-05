import { calculate, CalculationError } from './engine';

describe('decimal calculation engine', () => {
  const examples: Array<[string, string]> = [
    ['25 + 75', '100'], ['250 - 50', '200'], ['12 * 5', '60'], ['100 / 4', '25'],
    ['0.1 + 0.2', '0.3'], ['2 + 3 * 4', '14'], ['(2 + 3) * 4', '20'],
    ['200 + 10%', '220'], ['200 - 10%', '180'], ['200 * 10%', '20'],
    ['200 / 10%', '2000'], ['10%', '0.1'], ['-5 + 2', '-3'], ['2 * -3', '-6'],
    ['−5 + 2', '-3'], ['2 × 3', '6'], ['8 ÷ 2', '4'], ['.5 + .25', '0.75'],
    ['0002 + 3', '5'], ['1 / 8', '0.125'], ['(1 + (2 * 3))', '7'],
    ['1.234567890123456789 + 0.000000000000000001', '1.23456789012345679'],
  ];
  it.each(examples)('%s = %s', (input, expected) => expect(calculate(input)).toBe(expected));

  const failures = [
    ['', 'Enter an expression'], ['10 / 0', 'Cannot divide by zero'],
    ['1..2', 'Invalid number'], ['1 +', 'Incomplete expression'],
    ['(1+2', 'Missing closing parenthesis'], ['1+2)', 'Invalid expression'],
    ['2a+1', 'Unsupported character'], ['1 2', 'Invalid expression'],
    ['2**3', 'Invalid expression'], ['2%%', 'Invalid expression'],
    ['('.repeat(51) + '1' + ')'.repeat(51), 'Too many nested parentheses'],
    ['1'.repeat(201), 'Expression is too long'],
  ];
  it.each(failures)('rejects %s', (input, message) => {
    expect(() => calculate(input)).toThrowError(new CalculationError(message));
  });
});
