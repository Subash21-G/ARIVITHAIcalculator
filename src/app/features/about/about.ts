import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n';

@Component({
  selector: 'app-about',
  template: `<section class="panel tool info-page"><p class="eyebrow">ARIVITHAI</p><h1>{{i18n.t('about')}}</h1><p>{{i18n.t('aboutIntro')}}</p><p>{{i18n.t('aboutOffline')}}</p><p>{{i18n.t('aboutRounding')}}</p></section>`,
})
export class AboutComponent { readonly i18n = inject(I18nService); }
