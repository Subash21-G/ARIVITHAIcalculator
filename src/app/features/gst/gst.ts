import { Component, signal } from '@angular/core';
import { calculateGst, GstResult } from '../../core/calculation/finance';
import { CalculationError } from '../../core/calculation/engine';

@Component({selector:'app-gst',templateUrl:'./gst.html'})
export class GstComponent {
  amount=signal('1000'); rate=signal('18'); mode=signal<'exclusive'|'inclusive'>('exclusive');
  result=signal<GstResult|null>(null); error=signal(''); copied=signal(false);
  setAmount(event:Event){this.amount.set((event.target as HTMLInputElement).value);this.reset();}
  setRate(event:Event){this.rate.set((event.target as HTMLInputElement).value);this.reset();}
  setMode(event:Event){this.mode.set((event.target as HTMLSelectElement).value as 'exclusive'|'inclusive');this.reset();}
  reset(){this.result.set(null);this.error.set('');this.copied.set(false);}
  submit(event:Event){event.preventDefault();try{this.result.set(calculateGst(this.amount(),this.rate(),this.mode()));this.error.set('');}catch(error){this.result.set(null);this.error.set(error instanceof CalculationError?error.message:'Calculation failed');}}
  async copy(){const result=this.result();if(!result)return;try{await navigator.clipboard.writeText(result.total);this.copied.set(true);}catch{this.error.set('Could not copy the result');}}
}
