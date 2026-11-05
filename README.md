# ARIVITHAI Calculator

Angular 22 project following the development plan in this repository. Phases 1 through 4 include a responsive UI, precise basic arithmetic, GST and discount tools, local history, English and Tamil labels, and theme settings.

Phase 5 adds an installable offline PWA. Open it online once so the browser can cache the app, then it can reload and calculate offline. Android first-launch offline support is a separate phase.

## Run locally

Requires Node.js 24.15 or newer. In PowerShell use `npm.cmd` if script execution blocks `npm.ps1`.

```powershell
npm.cmd ci
npm.cmd start
```

Open `http://localhost:4200`. Run `npm.cmd run build` for a production build. See `docs/` for requirements, architecture and tests.

To test the PWA locally, build it and serve `dist/arivithai-calculator/browser` on `localhost` using a static server. The development server does not test production offline caching.
