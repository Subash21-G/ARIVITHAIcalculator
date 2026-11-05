import { Component, inject, signal } from '@angular/core';
import { calculateGst, GstResult } from '../../core/calculation/finance';
import { CalculationError } from '../../core/calculation/engine';
import { LocalStoreService } from '../../core/storage/local-store';
import { I18nService } from '../../core/i18n/i18n';

@Component({selector:'app-gst',templateUrl:'./gst.html'})
export class GstComponent {
  readonly store=inject(LocalStoreService); readonly i18n=inject(I18nService);
  amount=signal('1000'); rate=signal('18'); mode=signal<'exclusive'|'inclusive'>('exclusive');
  result=signal<GstResult|null>(null); error=signal(''); copied=signal(false);
  setAmount(event:Event){this.amount.set((event.target as HTMLInputElement).value);this.reset();}
  setRate(event:Event){this.rate.set((event.target as HTMLInputElement).value);this.reset();}
  setMode(event:Event){this.mode.set((event.target as HTMLSelectElement).value as 'exclusive'|'inclusive');this.reset();}
  reset(){this.result.set(null);this.error.set('');this.copied.set(false);}
  submit(event:Event){event.preventDefault();try{const result=calculateGst(this.amount(),this.rate(),this.mode());this.result.set(result);this.error.set('');this.store.add(`${this.amount()} @ ${this.rate()}% GST (${this.mode()==='exclusive'?'+':'incl.'})`,result.total);}catch(error){this.result.set(null);this.error.set(this.i18n.error(error instanceof CalculationError?error.message:'Calculation failed'));}}
  async copy(){const result=this.result();if(!result)return;try{await navigator.clipboard.writeText(result.total);this.copied.set(true);}catch{this.error.set(this.i18n.t('copyFailed'));}}
}
