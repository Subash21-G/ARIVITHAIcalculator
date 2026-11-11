# English and Tamil workflow audit

Date: 6 November 2026

## Fixed

- GST and Discount forms and results now survive navigation to Settings for a language change, as Basic calculations already do.
- Existing calculation errors are translated when the language changes.
- The calculator display, keypad, and mode navigation have English and Tamil screen-reader labels.
- Tamil descriptions for currency rounding and tax/discount amounts were corrected.

## Verified

- `npm.cmd run build`: passed.
- `npm.cmd test -- --watch=false`: 73 tests passed in 5 files.
- Chromium production-build checks: basic calculation, Tamil/English result words, GST inclusive calculation, discount calculation, invalid-input errors, state preservation across language changes, history words and clearing, reload persistence of language/history, and 320 px horizontal overflow.
- WebKit production-build check: calculation and result words remained correct when switching to Tamil.

## Limits

- Firefox did not complete startup in this Windows environment during the earlier phase 6 test; its bilingual workflow remains unverified here.
- A human Tamil-language review of every sentence has not been performed. The text corrections above cover the issues found in this audit.
- Draft calculations are preserved while navigating within the app; they are not stored across a full browser/app restart.
