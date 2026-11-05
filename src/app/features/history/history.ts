import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LocalStoreService } from '../../core/storage/local-store';
import { I18nService } from '../../core/i18n/i18n';

@Component({selector:'app-history',imports:[DatePipe],templateUrl:'./history.html'})
export class HistoryComponent {
  readonly store=inject(LocalStoreService); readonly i18n=inject(I18nService); readonly error=signal('');
  delete(id:string){this.store.delete(id);}
  clear(){if(window.confirm(this.i18n.t('clearConfirm')))this.store.clear();}
  async copy(value:string){try{await navigator.clipboard.writeText(value);this.error.set('');}catch{this.error.set(this.i18n.t('copyFailed'));}}
}
