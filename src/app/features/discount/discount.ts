import { Component, inject } from '@angular/core';
import { calculateDiscount } from '../../core/calculation/finance';
import { CalculationError } from '../../core/calculation/engine';
import { LocalStoreService } from '../../core/storage/local-store';
import { I18nService } from '../../core/i18n/i18n';
import { DiscountState } from './discount-state';

@Component({selector:'app-discount',templateUrl:'./discount.html'})
export class DiscountComponent {
  readonly store=inject(LocalStoreService); readonly i18n=inject(I18nService);
  private readonly state=inject(DiscountState);
  price=this.state.price; value=this.state.value; type=this.state.type;
  result=this.state.result; error=this.state.error; copied=this.state.copied;
  setPrice(event:Event){this.price.set((event.target as HTMLInputElement).value);this.reset();}
  setValue(event:Event){this.value.set((event.target as HTMLInputElement).value);this.reset();}
  setType(event:Event){this.type.set((event.target as HTMLSelectElement).value as 'percent'|'fixed');this.reset();}
  reset(){this.result.set(null);this.error.set('');this.copied.set(false);}
  submit(event:Event){event.preventDefault();try{const result=calculateDiscount(this.price(),this.value(),this.type());this.result.set(result);this.error.set('');this.store.add(`${this.price()} − ${this.value()}${this.type()==='percent'?'%':' ₹'}`,result.final);}catch(error){this.result.set(null);this.error.set(error instanceof CalculationError?error.message:'Calculation failed');}}
  async copy(){const result=this.result();if(!result)return;try{await navigator.clipboard.writeText(result.final);this.copied.set(true);}catch{this.error.set('Could not copy the result');}}
}
