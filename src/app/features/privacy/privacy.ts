import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n';

@Component({
  selector: 'app-privacy',
  template: `<section class="panel tool info-page"><p class="eyebrow">ARIVITHAI</p><h1>{{i18n.t('privacy')}}</h1><p>{{i18n.t('privacyIntro')}}</p><h2>{{i18n.t('privacyStoredTitle')}}</h2><p>{{i18n.t('privacyStored')}}</p><h2>{{i18n.t('privacySharingTitle')}}</h2><p>{{i18n.t('privacySharing')}}</p><h2>{{i18n.t('privacyDeleteTitle')}}</h2><p>{{i18n.t('privacyDelete')}}</p><h2>{{i18n.t('privacyOfflineTitle')}}</h2><p>{{i18n.t('privacyOffline')}}</p><h2>{{i18n.t('privacyContactTitle')}}</h2><p><a href="mailto:gsubashbose3333@gmail.com">gsubashbose3333@gmail.com</a></p></section>`,
})
export class PrivacyComponent { readonly i18n = inject(I18nService); }
