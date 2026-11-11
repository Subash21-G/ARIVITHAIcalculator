import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

const directory = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(directory, '../../src/app/core/i18n/i18n.ts'), 'utf8');
const start = source.indexOf('const en = {');
const end = source.indexOf('@Injectable', start);
if (start < 0 || end < 0) throw new Error('Could not find web translations');
const dictionaries = source.slice(start, end);
const output = `${dictionaries}\nexport function translate(key: Key, language: 'en' | 'ta'): string { return language === 'ta' ? ta[key] : en[key]; }\nexport function translateError(message: string, language: 'en' | 'ta'): string { return language === 'ta' ? tamilErrors[message] ?? message : message; }\n`;
writeFileSync(resolve(directory, '../src/translations.ts'), output);
