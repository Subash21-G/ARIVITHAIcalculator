import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BasicState {
  readonly expression = signal('');
  readonly result = signal('');
  readonly error = signal('');
}
