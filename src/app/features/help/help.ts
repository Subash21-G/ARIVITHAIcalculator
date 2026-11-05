import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n';

@Component({selector:'app-help',imports:[RouterLink],template:`<section class="panel tool"><p class="eyebrow">ARIVITHAI</p><h1>{{i18n.t('helpTitle')}}</h1><p class="intro">{{i18n.t('helpIntro')}}</p><ul><li>0.1 + 0.2 = 0.3</li><li>200 + 10% = 220</li><li>(2 + 3) × 4 = 20</li></ul><p>{{i18n.t('helpGst')}}</p><a routerLink="/">{{i18n.t('backTo')}}</a></section>`})
export class HelpComponent { readonly i18n=inject(I18nService); }
