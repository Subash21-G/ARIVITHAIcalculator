import { Component, computed, inject, signal } from '@angular/core';
import Decimal from 'decimal.js';
import { calculate, CalculationError } from '../../core/calculation/engine';
import { LocalStoreService } from '../../core/storage/local-store';
import { I18nService } from '../../core/i18n/i18n';
@Component({selector:'app-basic',templateUrl:'./basic.html',styleUrl:'./basic.scss'})
export class BasicComponent {
 readonly store=inject(LocalStoreService); readonly i18n=inject(I18nService);
 expression=signal('');
 result=signal('');
 displayedResult=computed(()=>this.result() && this.store.decimalDisplay()==='2' ? new Decimal(this.result()).toFixed(2) : this.result());
 error=signal('');
 keys=['AC','⌫','(',')','7','8','9','÷','4','5','6','×','1','2','3','−','±','0','.','+','%','='];
 press(key:string):void {
  if(key==='AC'){this.expression.set('');this.result.set('');this.error.set('');return;}
  if(key==='='){
   try { const value=calculate(this.expression()); this.result.set(value); this.error.set(''); this.store.add(this.expression(),value); }
   catch(error) { this.result.set(''); this.error.set(this.i18n.error(error instanceof CalculationError ? error.message : 'Calculation failed')); }
   return;
  }
  this.result.set(''); this.error.set('');
  if(key==='⌫'){this.expression.update(v=>v.slice(0,-1));return;}
  if(key==='±'){
   this.expression.update(v=>{
    const match=v.match(/(?:\d+(?:\.\d*)?|\.\d+)$/);
    if(!match)return v;
    const start=v.length-match[0].length;
    return start>0&&v[start-1]==='−'&&(start===1||/[+×÷(−]/.test(v[start-2])) ? v.slice(0,start-1)+match[0] : v.slice(0,start)+'−'+match[0];
   });
   return;
  }
  this.expression.update(v=>v.length<200?v+key:v);
 }
 onKeydown(event:KeyboardEvent):void {
  if(event.ctrlKey||event.metaKey||event.altKey||event.target instanceof HTMLInputElement)return;
  if(event.key==='Escape'){this.press('AC');event.preventDefault();return;}
  if(event.key==='Backspace'){this.press('⌫');event.preventDefault();return;}
  if(event.key==='Enter'||event.key==='='){this.press('=');event.preventDefault();return;}
  const key=event.key==='/'?'÷':event.key==='*'?'×':event.key==='-'?'−':event.key;
  if(/^[0-9.+()%]$/.test(key)||['÷','×','−'].includes(key)){this.press(key);event.preventDefault();}
 }
}
