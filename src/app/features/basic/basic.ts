import { Component, signal } from '@angular/core';
@Component({selector:'app-basic',templateUrl:'./basic.html',styleUrl:'./basic.scss'})
export class BasicComponent {
 expression=signal('');
 keys=['AC','⌫','(',')','7','8','9','÷','4','5','6','×','1','2','3','−','±','0','.','+','%','='];
 press(key:string):void {
  if(key==='AC'){this.expression.set('');return;}
  if(key==='⌫'){this.expression.update(v=>v.slice(0,-1));return;}
  if(key==='=')return;
  if(key==='±'){this.expression.update(v=>v.startsWith('−')?v.slice(1):v?'−'+v:'−');return;}
  this.expression.update(v=>v.length<200?v+key:v);
 }
 onKeydown(event:KeyboardEvent):void {
  if(event.ctrlKey||event.metaKey||event.altKey||event.target instanceof HTMLInputElement)return;
  if(event.key==='Escape'){this.press('AC');event.preventDefault();return;}
  if(event.key==='Backspace'){this.press('⌫');event.preventDefault();return;}
  const key=event.key==='/'?'÷':event.key==='*'?'×':event.key==='-'?'−':event.key;
  if(/^[0-9.+()%]$/.test(key)||['÷','×','−'].includes(key)){this.press(key);event.preventDefault();}
 }
}
