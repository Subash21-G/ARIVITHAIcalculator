# Phase 5 verification

- Production `npm.cmd run build` passed and generated `ngsw-worker.js` plus `ngsw.json`.
- The generated app cache includes the main bundle, `theme-init.js`, manifest, SVG favicon and PNG icons.
- On `http://localhost:8080`, the service worker controlled the page after an online load.
- Playwright browser context was taken offline. Basic `0.1+0.2` returned `0.3`; GST returned `₹1180.00`; discount returned `₹1600.00`; direct navigation to `/gst`, History, and reloads worked offline.
- Tamil and dark theme survived an offline reload. History remained available offline.
- After a new production build, the service worker installed the new version. The new Help example appeared after reload while seven stored history entries, Tamil and dark theme remained.
- `npm.cmd test -- --watch=false` passed 68 tests.

The PWA has not yet been checked in multiple browsers or as an installed app. Android first-launch offline testing is a separate phase.
