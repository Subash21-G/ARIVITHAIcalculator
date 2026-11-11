import { Injectable, signal } from '@angular/core';
import { DiscountResult } from '../../core/calculation/finance';

@Injectable({ providedIn: 'root' })
export class DiscountState {
  readonly price = signal('2000');
  readonly value = signal('20');
  readonly type = signal<'percent' | 'fixed'>('percent');
  readonly result = signal<DiscountResult | null>(null);
  readonly error = signal('');
  readonly copied = signal(false);
}
