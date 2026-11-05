import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n';
import { DecimalDisplay, Language, LocalStoreService, Theme } from '../../core/storage/local-store';

@Component({selector:'app-settings',templateUrl:'./settings.html'})
export class SettingsComponent {
  readonly store=inject(LocalStoreService); readonly i18n=inject(I18nService);
  setLanguage(event:Event){this.store.setLanguage((event.target as HTMLSelectElement).value as Language);}
  setTheme(event:Event){this.store.setTheme((event.target as HTMLSelectElement).value as Theme);}
  setDecimalDisplay(event:Event){this.store.setDecimalDisplay((event.target as HTMLSelectElement).value as DecimalDisplay);}
}
