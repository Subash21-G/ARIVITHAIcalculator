import Decimal from 'decimal.js';

const MathDecimal = Decimal.clone({ precision: 50, rounding: Decimal.ROUND_HALF_UP });
const MAX_LENGTH = 200;
const MAX_DEPTH = 50;

export class CalculationError extends Error {
  constructor(message: string) { super(message); this.name = 'CalculationError'; }
}

type Token = { kind: 'number' | 'operator' | 'paren' | 'percent'; value: string };
type Value = { amount: Decimal; percent: boolean };

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  for (let index = 0; index < input.length;) {
    const char = input[index];
    if (/\s/.test(char)) { index++; continue; }
    if (/[0-9.]/.test(char)) {
      const start = index;
      while (index < input.length && /[0-9.]/.test(input[index])) index++;
      const value = input.slice(start, index);
      if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) throw new CalculationError('Invalid number');
      tokens.push({ kind: 'number', value });
      continue;
    }
    if ('+-*/×÷−'.includes(char)) tokens.push({ kind: 'operator', value: char === '×' ? '*' : char === '÷' ? '/' : char === '−' ? '-' : char });
    else if ('()'.includes(char)) tokens.push({ kind: 'paren', value: char });
    else if (char === '%') tokens.push({ kind: 'percent', value: char });
    else throw new CalculationError('Unsupported character');
    index++;
  }
  return tokens;
}

export function calculate(expression: string): string {
  if (!expression.trim()) throw new CalculationError('Enter an expression');
  if (expression.length > MAX_LENGTH) throw new CalculationError('Expression is too long');
  const tokens = tokenize(expression);
  let position = 0;
  let depth = 0;
  const peek = () => tokens[position]?.value;
  const take = () => tokens[position++];

  function primary(): Value {
    if (++depth > MAX_DEPTH) throw new CalculationError('Too many nested parentheses');
    try {
      const token = take();
      if (!token) throw new CalculationError('Incomplete expression');
      if (token.value === '+' || token.value === '-') {
        const value = primary();
        return { amount: token.value === '-' ? value.amount.negated() : value.amount, percent: value.percent };
      }
      if (token.value === '(') {
        const value = sum();
        if (peek() !== ')') throw new CalculationError('Missing closing parenthesis');
        take();
        return value;
      }
      if (token.kind === 'number') return { amount: new MathDecimal(token.value), percent: false };
      throw new CalculationError('Invalid expression');
    } finally { depth--; }
  }

  function postfix(): Value {
    let value = primary();
    if (peek() === '%') {
      take();
      value = { amount: value.amount.div(100), percent: true };
    }
    return value;
  }

  function product(): Value {
    let left = postfix();
    while (peek() === '*' || peek() === '/') {
      const operator = take().value;
      const right = postfix();
      if (operator === '/' && right.amount.isZero()) throw new CalculationError('Cannot divide by zero');
      left = { amount: operator === '*' ? left.amount.mul(right.amount) : left.amount.div(right.amount), percent: false };
    }
    return left;
  }

  function sum(): Value {
    let left = product();
    while (peek() === '+' || peek() === '-') {
      const operator = take().value;
      const right = product();
      const amount = right.percent ? left.amount.mul(right.amount) : right.amount;
      left = { amount: operator === '+' ? left.amount.add(amount) : left.amount.sub(amount), percent: false };
    }
    return left;
  }

  const result = sum();
  if (position !== tokens.length) throw new CalculationError('Invalid expression');
  if (!result.amount.isFinite()) throw new CalculationError('Result is out of range');
  return result.amount.toString();
}
