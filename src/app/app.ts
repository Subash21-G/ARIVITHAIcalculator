import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { inject } from '@angular/core';
import { I18nService } from './core/i18n/i18n';
import { LocalStoreService } from './core/storage/local-store';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App { readonly i18n=inject(I18nService); readonly store=inject(LocalStoreService); }
