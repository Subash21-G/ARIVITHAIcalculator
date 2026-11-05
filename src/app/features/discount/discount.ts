import { Component, signal } from '@angular/core';
import { calculateDiscount, DiscountResult } from '../../core/calculation/finance';
import { CalculationError } from '../../core/calculation/engine';

@Component({selector:'app-discount',templateUrl:'./discount.html'})
export class DiscountComponent {
  price=signal('2000'); value=signal('20'); type=signal<'percent'|'fixed'>('percent');
  result=signal<DiscountResult|null>(null); error=signal(''); copied=signal(false);
  setPrice(event:Event){this.price.set((event.target as HTMLInputElement).value);this.reset();}
  setValue(event:Event){this.value.set((event.target as HTMLInputElement).value);this.reset();}
  setType(event:Event){this.type.set((event.target as HTMLSelectElement).value as 'percent'|'fixed');this.reset();}
  reset(){this.result.set(null);this.error.set('');this.copied.set(false);}
  submit(event:Event){event.preventDefault();try{this.result.set(calculateDiscount(this.price(),this.value(),this.type()));this.error.set('');}catch(error){this.result.set(null);this.error.set(error instanceof CalculationError?error.message:'Calculation failed');}}
  async copy(){const result=this.result();if(!result)return;try{await navigator.clipboard.writeText(result.final);this.copied.set(true);}catch{this.error.set('Could not copy the result');}}
}
