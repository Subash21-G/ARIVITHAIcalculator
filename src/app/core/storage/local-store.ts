import { Injectable, signal } from '@angular/core';

export type HistoryRecord = { id: string; expression: string; result: string; createdAt: string };
export type Language = 'en' | 'ta';
export type Theme = 'system' | 'light' | 'dark';
export type DecimalDisplay = 'auto' | '2';
type StoredData = { version: 1; history: HistoryRecord[]; language: Language; theme: Theme; decimalDisplay: DecimalDisplay };
const KEY = 'arivithai:v1';
const MAX_HISTORY = 100;
const empty = (): StoredData => ({ version: 1, history: [], language: 'en', theme: 'system', decimalDisplay: 'auto' });
function browserStorage(): Storage | null { try { return typeof localStorage === 'undefined' ? null : localStorage; } catch { return null; } }

function validRecord(value: unknown): value is HistoryRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record['id'] === 'string' && typeof record['expression'] === 'string' && record['expression'].length <= 200 && typeof record['result'] === 'string' && record['result'].length <= 200 && typeof record['createdAt'] === 'string' && !Number.isNaN(Date.parse(record['createdAt']));
}

export class LocalStore {
  private data: StoredData;
  readonly history = signal<HistoryRecord[]>([]);
  readonly language = signal<Language>('en');
  readonly theme = signal<Theme>('system');
  readonly decimalDisplay = signal<DecimalDisplay>('auto');
  readonly warning = signal('');

  constructor(private readonly storage: Storage | null = browserStorage()) {
    this.data = this.load();
    this.sync();
  }

  private load(): StoredData {
    try {
      const raw = this.storage?.getItem(KEY);
      if (!raw) return empty();
      const value = JSON.parse(raw) as Partial<StoredData>;
      if (value.version !== 1) return empty();
      return { version: 1, history: Array.isArray(value.history) ? value.history.filter(validRecord).slice(0, MAX_HISTORY) : [], language: value.language === 'ta' ? 'ta' : 'en', theme: value.theme === 'dark' || value.theme === 'light' ? value.theme : 'system', decimalDisplay: value.decimalDisplay === '2' ? '2' : 'auto' };
    } catch { this.warning.set('Local storage is unavailable; changes may not persist.'); return empty(); }
  }

  private sync(): void {
    this.history.set([...this.data.history]); this.language.set(this.data.language); this.theme.set(this.data.theme); this.decimalDisplay.set(this.data.decimalDisplay);
    if (typeof document !== 'undefined') { document.documentElement.lang = this.data.language; document.documentElement.dataset['theme'] = this.data.theme; }
  }

  private save(): void {
    this.sync();
    try { this.storage?.setItem(KEY, JSON.stringify(this.data)); if (!this.storage) throw new Error('No storage'); this.warning.set(''); }
    catch { this.warning.set('Local storage is unavailable; changes may not persist.'); }
  }

  add(expression: string, result: string): void {
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    this.data.history = [{ id, expression, result, createdAt: new Date().toISOString() }, ...this.data.history].slice(0, MAX_HISTORY);
    this.save();
  }
  delete(id: string): void { this.data.history = this.data.history.filter(item => item.id !== id); this.save(); }
  clear(): void { this.data.history = []; this.save(); }
  setLanguage(language: Language): void { this.data.language = language; this.save(); }
  setTheme(theme: Theme): void { this.data.theme = theme; this.save(); }
  setDecimalDisplay(display: DecimalDisplay): void { this.data.decimalDisplay = display; this.save(); }
}

@Injectable({ providedIn: 'root' })
export class LocalStoreService extends LocalStore { constructor() { super(); } }
