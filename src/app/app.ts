import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { inject } from '@angular/core';
import { I18nService } from './core/i18n/i18n';
import { LocalStoreService } from './core/storage/local-store';
import { SwUpdate } from '@angular/service-worker';
type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  readonly i18n=inject(I18nService); readonly store=inject(LocalStoreService);
  private readonly updates=inject(SwUpdate);
  private pendingInstall: InstallEvent | null = null;
  readonly canInstall=signal(false);
  readonly updateReady=signal(false);
  constructor() { this.updates.versionUpdates.subscribe(event => { if(event.type==='VERSION_READY') this.updateReady.set(true); }); }
  reloadForUpdate(): void { location.reload(); }
  @HostListener('window:beforeinstallprompt', ['$event'])
  onInstallAvailable(event: Event): void { event.preventDefault(); this.pendingInstall=event as InstallEvent; this.canInstall.set(true); }
  @HostListener('window:appinstalled')
  onInstalled(): void { this.pendingInstall=null; this.canInstall.set(false); }
  async install(): Promise<void> {
    const event=this.pendingInstall;
    if(!event)return;
    this.pendingInstall=null; this.canInstall.set(false);
    await event.prompt();
  }
}
