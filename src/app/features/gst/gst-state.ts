import { Injectable, signal } from '@angular/core';
import { GstResult } from '../../core/calculation/finance';

@Injectable({ providedIn: 'root' })
export class GstState {
  readonly amount = signal('1000');
  readonly rate = signal('18');
  readonly mode = signal<'exclusive' | 'inclusive'>('exclusive');
  readonly result = signal<GstResult | null>(null);
  readonly error = signal('');
  readonly copied = signal(false);
}
