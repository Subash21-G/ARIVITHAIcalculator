# ARIVITHAI CALCULATOR
## Complete Development-to-Launch Manual | Website + Offline PWA + Android App

**Edition:** 1.0 | **Prepared:** 05 November 2026 | **Project:** ARIVITHAI (அறிவிதை) Calculator

**Mission:** Build one high-quality, user-friendly calculator from a shared Angular codebase. It must work online and offline, launch as a public website, an installable PWA, and an Android application. Use free development tools and no paid APIs. Android Play publishing has a separate developer-registration fee.

**IMPORTANT:** This is an actionable plan, not a claim that the app is already built, tested, published, or approved. Complete the exit checklist of each phase before proceeding. Verify third-party platform policies again on the date you submit your app.

---

# 00. ONE-PAGE START HERE

## Project outcome

- Web: a fast, mobile-first ARIVITHAI Calculator website on HTTPS.
- PWA: installable web app that remains functional after the first successful online load and offline asset caching.
- Android: an installable native-container app whose bundled calculator works on its **very first launch with airplane mode enabled**.
- Common logic: safe, accurate calculator engine and shared UI, without a backend or AI/API dependency.
- Store locally: history, language, theme and preferences remain on device; web and Android records do **not** automatically sync.
- Release assets: source repository, test reports, screenshots, privacy policy, signed Android AAB and versioned release notes.

## Do these first, in order

1. Install/check Node.js, Git, VS Code and a supported Angular CLI.
2. Create `D:\Projects\arivithai-calculator` and an Angular project.
3. Create `docs/requirements.md`, `docs/test-cases.md`, and `docs/decisions.md`.
4. Make the basic calculator engine and 20+ automated calculation tests.
5. Build the mobile-first calculator screen; add GST and discount.
6. Add local history, Tamil/English translations and dark/light/system themes.
7. Enable PWA service worker; test actual offline mode on a production build.
8. Publish the website on Cloudflare Pages; run SEO and accessibility checks.
9. Package Android with Capacitor; test a physical phone in airplane mode.
10. Produce signed AAB, finish Play Console testing/policy steps, submit release.
11. Only after stable launch: consider AdSense/AdMob and growth campaigns.

## Success condition

A user can calculate `0.1 + 0.2 = 0.3`, compute GST and discounts, save/view history, switch languages, close and reopen the app, and repeat all these tasks **with internet turned off**. No math feature depends on the server.

---

# 01. PRODUCT SPECIFICATION AND SCOPE

## Audience and core promise

- Audience: students, shopkeepers, salaried workers and everyday users in India; usable by anyone.
- Promise: opens directly into the calculator, immediate result, large buttons, no forced login and clear Tamil/English labels.
- Differentiation: accurate decimal calculations, Indian GST/discount tools, accessible layout, reliable offline use and uncluttered design.

## Version 1 — MUST have

- Basic arithmetic: `+`, `-`, `*`, `/`, decimal, parentheses, sign toggle, backspace, clear, equals.
- Correct operator precedence and consistent percent semantics.
- Scientific-style errors handled gracefully: division by zero, malformed expression and overflow.
- GST: inclusive/exclusive tax, custom rate, base amount, tax amount and total; round/display money appropriately.
- Discount: fixed percent or amount discount, savings amount, final amount; validation of range.
- Calculation history: list, copy, delete item, clear all and persistent storage.
- Copy result; keyboard shortcuts on desktop; touch-friendly mobile layout.
- Localization: English + Tamil; all strings stored locally (not loaded from a network API).
- Light/dark/system themes, font scaling where feasible, responsive UI and screen-reader labels.
- Online + offline support, browser PWA install prompt when supported, no mandatory account.
- Privacy policy, About, Help, Contact and original calculator usage examples.

## Version 1 — deliberately NOT included

- No login or cloud synchronization; no online AI; no bank connections; no paid API.
- No mandatory ads, push notification service, payments, camera or location permission.
- No proprietary ISO engineering tolerance tables or copyrighted third-party datasets.

## Optional after launch (Version 2)

- Scientific calculator, unit conversion, EMI/age/date tools and history backup/export.
- Optional user-selectable memory operations (M+, M-, MR, MC).
- These are independent enhancements: do not delay V1 quality for them.

## Functional acceptance criteria

- Startup shows working calculator without splash-screen delay or account prompts.
- All operation buttons and keyboard paths produce equivalent results.
- No app crash on invalid expression, huge input or repeated taps.
- All essential pages and labels work at 320 px through desktop widths.
- Offline functionality passes real airplane-mode tests on both platforms.

---

# 02. UX DESIGN AND SCREEN PLAN

## Information architecture

- `Basic` — default calculator keyboard and result.
- `GST` — taxable value, GST %, inclusive/exclusive mode and breakdown.
- `Discount` — original price, discount type/value, savings and final price.
- `History` — recent calculations and item actions.
- `Settings` — Tamil/English, theme, decimal display, delete history and About.
- `Help` — real use examples, keyboard shortcuts, FAQ and feedback contact.

## Default keypad

```
ARIVITHAI Calculator                    History | Settings
-------------------------------------------------------
Expression:                         (1250 + 750) / 2
Result:                                        1,000
-------------------------------------------------------
     AC       Back      (%)       ( / )
      7         8         9         x
      4         5         6         -
      1         2         3         +
     +/-        0         .         =
-------------------------------------------------------
 Basic       GST       Discount       History
```

Parentheses may have separate compact controls above the keypad to avoid hiding them. Do not use icon-only actions without accessible names.

## UI acceptance checklist

- Touch targets approximately 44-48 CSS px or more; accessible focus state.
- Readable numbers, sufficient contrast, large result field; layout never clips on a small phone.
- Visible error state instead of `NaN`, `Infinity`, blank screen or silent failure.
- Test 200% browser zoom, Tamil glyph rendering, portrait landscape, screen readers.
- Theme does not flash unexpectedly on startup; selected language remains after reload.
- Buttons do not trigger the wrong operation on rapid double taps.
- No full-screen ads or popup blocking input; no dependency on fonts from CDNs.

## Visual design tokens (adjustable)

- Background: warm off-white for light theme, dark navy-charcoal for dark theme.
- Accent: teal for primary actions; use consistent semantic error color.
- Typography: local/bundled fonts with Tamil glyph support and proper license.
- Style: calm, minimal, rounded controls, gentle animation with reduced-motion support.

---

# 03. MATH AND CALCULATOR ENGINE SPEC

## Technical rule: do not use `eval()`

Implement tokenizer -> parser (for example shunting-yard or recursive descent) -> evaluator. The parser accepts only defined tokens/operators. Use `decimal.js` or an equivalent precise decimal library for arithmetic; format separately from internal values.

## Operation requirements

- Addition / subtraction / multiplication / division.
- Unary minus and positive/negative toggle.
- Parentheses and correct precedence (`*`/`/` before `+`/`-`).
- A second decimal dot in one operand must be ignored or rejected cleanly.
- Define max expression length and graceful error messages.
- Preserve decimal precision internally; only round for display or currency rules.
- Save completed successful calculations in history, not every button press.

## Percent semantics — define and document in one place

Use the common calculator-style rules below, then validate through tests:

- `200 + 10%` -> `220` (adds 10% of 200).
- `200 - 10%` -> `180` (subtracts 10% of 200).
- `200 * 10%` -> `20` (multiplies by 0.10).
- `200 / 10%` -> `2,000` (divides by 0.10).
- A standalone `10%` -> `0.1`.

Avoid leaving `%` behavior ambiguous. Separate GST/Discount tools must use their own explicit formulas rather than relying on expression-token interpretation.

## GST formulas

- Add GST: `tax = base * rate / 100`; `total = base + tax`.
- Remove inclusive GST: `base = total / (1 + rate/100)`; `tax = total - base`.
- If rate is 0%, tax=0. Reject negative rate or invalid numeric input.
- Allow entering a custom GST rate; do **not** claim a default rate applies to all Indian goods.
- Show sensible 2-decimal currency output; describe display rounding.
- Do not present GST tool as tax advice. Rates should be verified by the user.

## Discount formulas

- Percentage discount: `saved = price * percent / 100`; `final = price - saved`.
- Fixed discount: `final = max(price - fixedAmount, 0)` only if product rules explicitly allow cap; otherwise error on fixed discount > price.
- Reject negative price, percent < 0 or percent > 100 and malformed input.

## Mandatory example tests

```
25 + 75                      => 100
250 - 50                     => 200
12 * 5                       => 60
100 / 4                      => 25
0.1 + 0.2                    => 0.3
2 + 3 * 4                    => 14
(2 + 3) * 4                  => 20
200 + 10%                    => 220
200 * 10%                    => 20
1000 plus 18% GST            => 1180
1180 inclusive of 18% GST    => base 1000; tax 180
2000 discounted by 20%       => 1600
10 / 0                       => controlled error
```

Further tests: negative sign, huge decimals, deep parentheses, leading zeros, operator repetition, backspace, clear and equal-repeat behavior.

---

# 04. ARCHITECTURE, FILE STRUCTURE AND LOCAL STORAGE

## Architecture

```
Angular UI (web / Android WebView)
    -> feature components and keyboard input
    -> calculation, GST and discount services
    -> pure arithmetic engine (no browser APIs, easy unit testing)
    -> history/settings storage adapter
    -> IndexedDB or localStorage (small data only)
    -> packaged assets / local translation strings

Web: Angular app + PWA service worker + static HTTPS hosting
Android: packaged Angular dist + Capacitor native container
```

## Recommended folder structure

```
arivithai-calculator/
  src/app/
    core/calculation/         # tokenizer, parser, evaluator, types
    core/storage/             # history/settings adapter, migrations
    core/i18n/                # language service and dictionaries
    features/basic/           # default calculator
    features/gst/             # GST screen
    features/discount/        # discount screen
    features/history/         # saved calculations
    features/settings/        # theme, language, clear history
    shared/components/        # keypad, numeric display, tabs
    app.routes.ts
  public/icons/               # local PWA/store branding assets
  public/robots.txt
  public/sitemap.xml
  docs/                       # this plan, test reports, releases
  e2e/                        # Playwright tests
  android/                    # generated later by Capacitor
  angular.json
  capacitor.config.ts         # created later
  package.json
```

## Storage design

History record example:

```
{
  "id": "uuid",
  "expression": "(1250+750)/2",
  "result": "1000",
  "createdAt": "2026-11-05T10:30:00.000Z"
}
```

- Save decimal values as strings if preserving exact textual output matters.
- Use a versioned schema and cap history (for example the most recent 100-500 valid entries).
- Implement clear-history confirmation and graceful handling of storage being unavailable/full.
- History is **local per installation**: browser, PWA and Android do not share state by default.
- Device uninstall, clearing app storage or clearing browser data can erase local history.
- V1 can offer optional JSON export/import; if added, validate schema, size and safe merge behavior.
- No analytics, cloud sync or network transmission of personal calculations by default.

---

# 05. WINDOWS TOOL SETUP (FREE)

## Required for website and PWA

1. VS Code — https://code.visualstudio.com/
2. Git — https://git-scm.com/
3. Node.js — https://nodejs.org/
4. Angular CLI — run with `npx` to avoid global-version conflicts.
5. Chrome / Edge / Firefox to test browsers.
6. GitHub account and Cloudflare Pages account (free tiers).

Angular 22 is the selected baseline. Check Node compatibility at https://angular.dev/reference/versions (Angular 22 accepts supported Node 24 releases, including Node >=24.15.0 within v24).

## PowerShell: verify installation

```powershell
node -v
npm -v
git --version
```

## Create project (skip mkdir if folder exists)

```powershell
New-Item -ItemType Directory -Force D:\Projects
Set-Location D:\Projects
npx @angular/cli@22 new arivithai-calculator --routing --style=scss --ssr=false
Set-Location D:\Projects\arivithai-calculator
npm install decimal.js
npm start
```

Open `http://localhost:4200`. Check generated `package.json`, `angular.json`, routes and default tests. Do not copy a whole existing project's config blindly.

## Project initialization tasks

- Create README describing setup, architecture, commands and screenshots.
- Add `.editorconfig`, formatting and lint settings if desired.
- Keep `.gitignore` up to date; never commit API keys, secrets or signing keystores.
- Make initial Git commit after `npm run build` passes.
- Put all requirements and acceptance criteria in `docs/` before asking AI to code.

---

# 06. PHASE-BY-PHASE BUILD ROADMAP

Each phase needs a code commit, evidence and an explicit exit test. Do not accept AI's claim that a test passed unless it actually ran.

## PHASE 0 — Requirements and project preparation

Tasks:
- Read this manual; decide V1 scope and percent semantics.
- Create `docs/requirements.md`, `docs/test-cases.md`, `docs/architecture.md`.
- Confirm app name, package ID placeholder, primary language and brand assets.
- Define privacy and offline test expectations.

Exit: written scope approved; repository initialized; no unanswered core calculation rule.

## PHASE 1 — Angular scaffold and responsive design

Tasks:
- Create Angular 22 application and route shells.
- Build keypad, result view, tabs and header as reusable components.
- Implement desktop keyboard binding, accessible labels and focus states.
- Design light/dark color tokens, reduced-motion and 320px responsive layout.

Exit: app runs, navigation works and displays correctly on small/large screens.

## PHASE 2 — Arithmetic engine

Tasks:
- Implement tokenizer/parser/evaluator (no `eval`).
- Add correct operator precedence, parentheses, sign toggle, percent semantics.
- Use decimal arithmetic; handle invalid expressions and division by zero.
- Write thorough unit tests and fix all failures.

Exit: all approved math examples pass automated tests and manual keypad test.

## PHASE 3 — GST and discount modes

Tasks:
- Build validated numeric forms and mode selector.
- Compute both inclusive/exclusive GST and clear breakdown.
- Compute percentage/fixed discounts, savings and final amount.
- Apply currency display rules; offer copy/share result if reliable.

Exit: results match trusted manual calculations for edge cases; zero network needed.

## PHASE 4 — History, settings and localization

Tasks:
- Save successful calculations locally; view, copy, delete, clear history.
- Persist language, theme and decimal-format preferences.
- Add complete English and Tamil translation resources, bundled in app.
- Show user-friendly error/empty states; handle disabled local storage.

Exit: data persists after refresh/restart; Tamil UI complete and readable.

## PHASE 5 — PWA and offline-first web

Tasks:
- Run `npx ng add @angular/pwa`.
- Replace generated icons and confirm valid `manifest.webmanifest`.
- Bundle fonts, icons, translations and assets; avoid remote runtime dependencies.
- Configure and inspect `ngsw-config.json` for application asset caching.
- Build production output and serve over localhost/HTTPS to test service worker.
- Install PWA (supported browser), turn network off and reload relevant pages.
- Test cache version updates and rollback/data preservation.

Exit: PWA works after an initial complete online installation/load, then offline.

## PHASE 6 — Quality engineering

Tasks:
- Unit tests: parser, math, GST, discount, history, settings and localization.
- Playwright: keyboard/touch flows, routing, responsive layouts, reload/offline.
- Manual cross-browser/accessibility/performance review.
- Threat review: XSS, input validation, third-party package licenses, no secrets.
- Maintain bug log and re-run regression tests after fixes.

Exit: no unresolved critical/high bugs; repeatable automated tests pass.

## PHASE 7 — Web deployment

Tasks:
- Push release-ready source to GitHub.
- In Cloudflare Pages choose Git integration at project creation.
- Build command: `npm run build`.
- Set output folder by inspecting actual `dist/` output and `angular.json` (often `dist/arivithai-calculator/browser`; platform configurations can differ).
- Deploy and verify generated HTTPS URL, direct navigation, cache and updates.
- Enable versioned releases / Cloudflare preview builds as applicable.

Exit: public website works with online and post-cache offline use, including deep links.

## PHASE 8 — Android generation with CLI (without Android Studio IDE)

Tasks:
- Install supported Java JDK, Android SDK Command-line Tools and Platform-Tools.
- Set `ANDROID_HOME` / SDK path, Java/Gradle environment and install API 36 platform/build tools where applicable.
- Add Capacitor runtime and CLI, configure stable package ID and correct `webDir`.
- Build Angular assets, run `npx cap sync android`, use Gradle wrapper for APK.
- Connect physical phone with USB debugging; install and airplane-mode test.
- Verify all components work as packaged local assets, not as a remote website.

Exit: debug APK opens for the first time while offline and all V1 functions pass.

## PHASE 9 — Google Play release

Tasks:
- Register developer account and complete identity/payment requirements.
- Create and securely back up the signing/upload key; configure signed release AAB.
- Prepare store icon, screenshots, feature graphic, descriptions and support email.
- Publish accessible privacy policy, accurate Data Safety and ads declarations.
- Target current required Android API level (API 36 for new phone apps, as of Nov 2026).
- If new personal-account rules apply: 12 opted-in testers continuously for 14 days; document feedback and apply for production access.
- Upload signed AAB, complete content rating, target audience and policy questionnaires, review and publish when approved.

Exit: approved public Play Store listing; install/reinstall/update on real phone passes.

## PHASE 10 — SEO, ASO and legitimate user growth

Tasks:
- Create public pages for calculator, how-to, GST guide, discount examples, FAQ, About, Privacy and Contact.
- Use unique page titles, descriptions, canonicals, sitemap and valid robots rules.
- Add Google Search Console property, check indexing and core web vitals.
- Optimize Play screenshots/description truthfully; monitor listing conversion.
- Publish non-spammy Tamil/English tutorials; use genuine user feedback.

Exit: search tooling connected; helpful public content and feedback channels live.

## PHASE 11 — Optional monetization (after stable launch)

Tasks:
- For website: review AdSense eligibility and quality, add publisher verification if approved.
- For native Android: integrate compatible Mobile Ads SDK/plugin, first with test ads.
- Follow AdMob app-store linking, developer website + app-ads.txt and app readiness review.
- Update privacy disclosures and applicable consent flows before enabling ads.
- Never interrupt calculator input or require ads for essential offline operation.

Exit: ads run only after necessary approvals, verified test-to-production migration, and compliance checks. No income is guaranteed.

## PHASE 12 — Maintenance and future projects

Tasks:
- Monitor Play vitals, errors, crash reports, support tickets, SEO and ad status.
- Publish semantic versions, changelog, regression tests and store release notes.
- Keep Android API targets, dependencies and policies up to date.
- Reuse tested UI/theme/storage/offline code for other ARIVITHAI utility apps.

Exit: documented repeatable update/release workflow and recovery procedure.

---

# 07. PWA BUILD AND OFFLINE TESTS

## Enable and verify

```powershell
npx ng add @angular/pwa
npm run build
```

Service workers normally operate on secure contexts (HTTPS or localhost). For realistic offline tests, **serve a production build**, visit it online first, then enable browser DevTools Offline and reload. Do not assume a development server proves the PWA works offline.

## Offline checklist for website

- First online load completes and caches all required assets.
- Browser DevTools Application > Service Workers shows active service worker.
- Installed PWA opens and Basic/GST/Discount/History all work offline.
- On refresh with no network, all cached routes still open.
- Translation strings and fonts render offline.
- Local history persists offline and after reconnecting.
- Update behavior is tested; new deployment does not destroy stored history.

## Separate Android requirement

Android package must ship with all Angular assets bundled in the APK/AAB. **First-ever launch after installation in airplane mode** must work, unlike the website PWA that usually needs a prior complete online load/cache.

---

# 08. ANDROID CLI SETUP WITHOUT ANDROID STUDIO

**Support note:** Capacitor's standard official Android workflow recommends Android Studio. Building without the IDE is technically possible with manually installed Android SDK, suitable JDK and Gradle wrapper, but environment and plugin problems require manual troubleshooting. If this becomes a blocker, installing Android Studio is the supported fallback; a cloud packaging tool may be simpler for web-only PWAs but less flexible for native AdMob.

## Install prerequisites

- JDK matching the selected Android Gradle Plugin/Capacitor version; check its compatibility documentation.
- Android SDK Command-line Tools (`sdkmanager`), Android SDK Platform-Tools (`adb`), Android platform API 36, matching build-tools and accepted licenses.
- Set Windows `ANDROID_HOME` to the SDK directory and update PATH for `platform-tools` and `cmdline-tools/latest/bin`.
- A real Android phone: enable Developer Options + USB Debugging and authorize the PC.

## Capacitor commands from Angular project root

```powershell
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli
npx cap init
# Choose app name: ARIVITHAI Calculator
# Choose a unique package ID you control, e.g. in.arivithai.calculator
# Confirm capacitor.config.ts webDir matches the Angular output containing index.html
npx cap add android
npm run build
npx cap sync android
```

## Device and Gradle commands

```powershell
adb devices
Set-Location .\android
.\gradlew.bat assembleDebug
# Debug APK: android/app/build/outputs/apk/debug/app-debug.apk
# Install using the actual APK path:
adb install -r .\app\build\outputs\apk\debug\app-debug.apk
# For a release bundle after proper signing configuration:
.\gradlew.bat bundleRelease
```

Do not upload an unsigned release AAB. Store keystore and passwords outside Git; create backup. AAB is for Play upload; a debug APK is for local testing. Update `versionCode` for every Play release.

## Physical Android offline test

1. Install the debug build while internet is available.
2. Force-stop app, enable airplane mode, clear app data only if deliberately testing first-launch state; launch again.
3. Reinstall if necessary, airplane mode ON **before first launch**; verify basic calculations.
4. Test GST, discount, history, language and theme fully offline.
5. Rotate phone, use back gesture, test keyboard, large text and app background/restore.
6. Turn internet on and off several times; no calculation data disappears.
7. Test an app update via a compatible signed build without deleting history.

---

# 09. WEBSITE HOSTING AND SEO OPERATIONS

## Cloudflare Pages flow

- GitHub: push to `main` and keep a clean README, license if chosen, docs and tests.
- Cloudflare > Workers & Pages > Create > Pages > connect Git repository.
- Build command: `npm run build`; select the actual generated static output folder.
- Deploy; confirm HTTPS and routing. Use free `*.pages.dev` subdomain to start.
- Ensure static hosting supports Angular route fallback (`index.html`) for deep links.
- Add custom domain only if useful; it may have a yearly cost.
- Add uptime/manual monitoring, redirects, 404 page and security headers as appropriate.

## SEO/content before AdSense application

- `/` or `/calculator`: working tool, user-friendly intro and feature description.
- `/gst-calculator`: tool and original GST examples; avoid inaccurate claims.
- `/discount-calculator`: tool and example calculations.
- `/guides/percentage-calculation`: helpful examples and common mistakes.
- `/about`, `/contact`, `/privacy-policy`, `/terms` as appropriate.
- Original titles, descriptions, accessible navigation, mobile performance.
- Public content should have crawlable HTML; use Angular prerendering/SSR selectively if needed for SEO. No-index private history/settings.
- Submit sitemap in Google Search Console and inspect indexing; ranking not guaranteed.

---

# 10. GOOGLE PLAY ASSETS AND SUBMISSION CHECKLIST

## Listing assets

- Product name, short description, detailed accurate description.
- App icon (512 x 512 px), feature graphic (1024 x 500 px), real screenshots; verify latest format requirements in Play Console.
- Support contact email, developer website, accessible privacy policy URL.
- Screenshots reflect real functions; do not mislead about offline behavior or ads.

## Play policy / release

- One-time Play Console developer account fee (historically US $25; check current checkout).
- Identity verification and required merchant/payment details if any.
- Correct package ID, target API, bundle signing and Play App Signing setup.
- Correct Data Safety, permissions, ads, content rating and target audience answers.
- As of Nov 2026, new standard Android apps target API 36 or higher.
- New personal developer accounts created after 13 Nov 2023 generally must test with at least 12 opted-in testers continuously for 14 days before applying for production access.
- Complete Play's final review; public launch cannot be guaranteed by a date.

## After publishing

- Install from Play Store, not only local APK; verify correct version and offline features.
- Check crashes/ANRs, uninstalls, ratings, support emails and store policy notices.
- Use staged rollouts where supported; publish fixes with a higher `versionCode`.

---

# 11. PRIVACY, SECURITY, LICENSING AND MONETIZATION

## V1 privacy stance

- No account; no calculator data sent to a server.
- History/settings live in local storage; publish truthful policy explaining persistence and deletion.
- No camera/location/contacts permissions; request none unless required for a specific feature.
- No need to store NVIDIA/OpenAI or other API keys in frontend; V1 has no API calls.
- Use commercially permitted fonts/icons/libraries, preserve required copyright notices.

## Ads and costs

- V1 can launch with **zero ads** and zero API charges.
- Website AdSense review is separate from Google Play publication.
- Native Android AdMob requires an appropriate native SDK/plugin, store-linked app, app-ads.txt verification and app readiness approval.
- The user must be able to calculate offline even if the ad SDK fails or internet is absent.
- Test ad units during development, no self-clicks or incentivized clicking.
- If ads, analytics or consent tooling are added later, revise the privacy policy and store Data Safety declarations.
- Download counts alone do not create revenue. Revenue can be zero.

## Cost checklist

- VS Code, Angular, TypeScript, Capacitor, decimal.js, Playwright: free open-source development tooling (respect individual licenses).
- GitHub and Cloudflare Pages: free tiers with limits.
- Local history: no paid database or backend required.
- Google Play public publishing: separate one-time registration fee.
- Custom domain, paid AI model, cloud sync and advertising operations: optional future expenses.

---

# 12. TEST MATRIX / RELEASE GATES

## Unit test suite (must automate)

- Addition/subtraction/multiplication/division, precedence, unary operators, parentheses.
- `0.1+0.2`, very long decimals, leading zeros, repeated operators, input length.
- Defined `%` cases, including `200+10%`, `200*10%`, standalone percent.
- `10/0`, blank input, invalid tokens, malformed and nested parentheses.
- GST add/remove at 0%, 5%, 12%, 18% and custom rates; proper display rounding.
- Discounts at 0%, 100%, negative/greater-than-100 rejection and fixed amount rules.
- History save/delete/clear/cap, storage exception and settings migration.

## Playwright test suite

- Keyboard + mouse + touch input produce correct results.
- Navigate between modes; focus management and labels present.
- Reload preserves history, theme and language.
- Test small phones, tablets, desktop, browser zoom and landscape.
- Production PWA cache test with offline mode after first successful load.
- No unexplained external network dependency for calculations.

## Android real-device test suite

- Fresh install + first offline launch; air-plane mode ON throughout.
- GST, discount, history, theme and Tamil work with no network.
- App reopen, background/resume and screen rotate.
- OS back navigation, larger font, keyboard overlays and memory pressure.
- Upgrade version without data loss; test with multiple Android versions if possible.
- Release-signed build install and Play-delivered build verification.

## Release gating conditions

- No unresolved P0/P1 (critical/high) defects.
- Required calculation and persistence tests pass and evidence recorded.
- Production build passes and PWA/Android offline tests pass.
- Legal/support/privacy pages are live and correct.
- APK/AAB versions, signing keys and Play data declarations verified.
- All essential functions available without network or ad serving.

---

# 13. GITHUB AND CI/CD MAINTENANCE WORKFLOW

## Git practice

- `main`: production-ready only; use `feature/*` for individual features.
- Each feature PR: description, screenshots, test results, risk and rollback plan.
- Commit source, lockfiles, docs and tests, not `node_modules`, `.env`, API keys or keystore.
- Tag milestones (`v0.1.0`, `v0.2.0`, `v1.0.0`).

## CI pipeline outline

```
On pull request / push:
  - checkout repository
  - install compatible Node.js
  - npm ci
  - npm run build
  - ng test --watch=false
  - npx playwright test (once configured with browsers)
  - upload report on failure
On merge to main:
  - Cloudflare Pages web deploy
Android release (manual gate):
  - build web assets, sync Android, check signing
  - generate signed AAB, smoke-test, upload to Play
```

## After launch routine

- Triage bug reports and reviews; distinguish feature requests from defects.
- Monitor storage-loss issues; do not unexpectedly reset users' data on updates.
- Recheck dependencies and Play API target/policy changes before each release.
- Track Core Web Vitals, search queries, Play vitals and returning users.
- Keep a changelog and known-issues page.

---

# 14. COPY-PASTE AI CODING ASSISTANT PROMPTS

## MASTER PROMPT — paste into VS Code coding assistant

```
Act as a careful senior Angular and Android engineer. Build ARIVITHAI Calculator,
a free, privacy-first calculator as (1) responsive website, (2) installable
PWA, and (3) Android app. We use Angular 22, TypeScript, SCSS, decimal.js,
Angular PWA service worker, Capacitor, Vitest and Playwright. Follow the
project development manual in docs/.

CRITICAL CONSTRAINTS:
- The calculator, GST, discount, history, localization and themes work online
  and offline. Native Android must work from first launch in airplane mode.
- No login, backend, paid API, remote fonts or runtime CDN dependencies.
- Never use eval() or unsafe expression evaluation.
- All user history is local; do not silently upload or reset it.
- Build mobile-first, accessibility-first and support Tamil plus English.
- Do not expose API keys or signing credentials.
- Never claim a test passed unless you ran it successfully.

First inspect the existing repository. Create/update docs/architecture.md,
docs/requirements.md, docs/test-cases.md and a phased task checklist.
Implement ONLY the current phase. Before editing, explain the planned file
changes. After editing, run available build/tests, report actual command
results, bugs and any remaining work. Request approval before destructive
operations, credential changes, production deployments or moving to the next
phase.

Start with PHASE 1: Angular scaffold, reusable responsive UI, routes, design
tokens, calculator keypad and accessible display. Do not implement all phases
in a single response.
```

## Phase prompts (send one at a time)

**Phase 2 / Core math:** Implement a safe typed tokenizer/parser/evaluator with decimal.js. Match the example test matrix exactly; include precedence, parentheses, percent behavior and division-by-zero errors. Write and run unit tests.

**Phase 3 / GST + Discount:** Build form components for inclusive/exclusive GST and percentage/fixed discounts, with strict input validation and calculation tests. Use local math only.

**Phase 4 / Storage + Languages:** Add persistent local history, clear/delete actions, local English/Tamil dictionary and saved theme preference. Test all after browser reload.

**Phase 5 / Offline:** Configure Angular PWA and local assets. Produce a production build; test offline reload with cached files. Verify no network dependency for core calculator functions.

**Phase 6 / QA:** Configure or improve Vitest and Playwright suites. Test all modes, keyboard/touch, mobile widths, invalid input and production PWA offline. Fix failures.

**Phase 7 / Hosting:** Prepare Cloudflare Pages configuration, GitHub README, public SEO/help/privacy pages and verify production route behavior. Do not deploy without access and explicit approval.

**Phase 8 / Android:** Add Capacitor, validate `webDir`, generate Android project. Provide supported JDK/SDK commands for Windows without assuming Android Studio is installed. Build debug APK and prepare phone-based offline tests. Never invent build success.

**Phase 9 / Store:** Prepare Play Store release checklist and draft text/assets specifications, verify target API, signing and testing requirements. Do not publish or spend money without approval.

**Phase 10 / Growth:** Prepare original SEO tutorial topics, Search Console checklist, ASO description, release notes and monthly KPI template. Avoid promises of rankings or revenue.

**Phase 11 / Ads:** Plan optional AdSense and AdMob integration using test IDs only. Verify app-ads.txt, compliance and consent requirements. Do not enable live ads until ready and approved.

---

# 15. MASTER PROJECT CHECKLIST — MARK EACH ITEM

```
[ ] Requirements finalized and percent behavior documented
[ ] Angular project created, builds successfully
[ ] GitHub repository clean; no secrets checked in
[ ] Accessible responsive basic UI works
[ ] Calculation engine + decimal arithmetic correct
[ ] Math unit tests all pass
[ ] GST inclusive/exclusive tool correct
[ ] Discount percentage/fixed tool correct
[ ] History persists; delete and clear work
[ ] Tamil and English UI complete
[ ] Light/dark/system themes work
[ ] No mandatory remote assets or network calls
[ ] Angular PWA installed and production offline tested
[ ] Playwright desktop/mobile workflows pass
[ ] Privacy/Help/About/Contact public pages complete
[ ] Cloudflare website is live and HTTPS verified
[ ] Search Console property and sitemap checked
[ ] Android SDK/JDK/ADB correctly installed
[ ] Capacitor `webDir`, package ID and Android build verified
[ ] Debug APK installed on physical phone
[ ] FIRST Android launch in airplane mode works
[ ] All Android offline screens and persistence tested
[ ] Secure release signing and AAB created
[ ] Store screenshots, icon, description and policy declarations done
[ ] Applicable Play closed testing completed; production access approved
[ ] Public Play Store app released and installed from store
[ ] Monitoring/feedback/release update process ready
[ ] Optional AdSense/AdMob approvals and compliance checked
[ ] Version v1.0.0 documented and tagged
```

---

# 16. REFERENCES — OFFICIAL DOCUMENTATION

- Angular version compatibility: https://angular.dev/reference/versions
- Angular service worker/PWA setup: https://angular.dev/ecosystem/service-workers/getting-started
- Capacitor getting started: https://capacitorjs.com/docs/getting-started
- Capacitor environment setup (Android Studio officially recommended): https://capacitorjs.com/docs/getting-started/environment-setup
- Android command-line builds: https://developer.android.com/build/building-cmdline
- Google Play target API policy: https://developer.android.com/google/play/requirements/target-sdk
- Google Play testing requirements: https://support.google.com/googleplay/android-developer/answer/14151465
- Cloudflare Pages Angular hosting: https://developers.cloudflare.com/pages/framework-guides/deploy-an-angular-site/
- AdMob app-ads.txt: https://support.google.com/admob/answer/9363762
- AdMob app readiness: https://support.google.com/admob/answer/10564477
- Google Search Console: https://search.google.com/search-console
- Play Console: https://play.google.com/console/

**Last important rule:** Complete one phase, verify it, commit it, then move to the next. Never publish an untested Android bundle or use an exposed API key. This plan is the baseline for the first ARIVITHAI release and can be adapted for future daily-use applications.
