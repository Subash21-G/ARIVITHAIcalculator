# Release status — 11 November 2026

## Verified locally

- Web unit tests: 73/73 passed; production build passed.
- Android JavaScript: TypeScript check and offline Expo export passed. Dependency validation in offline mode remains provisional.
- Browser suite: 38 passed across Chromium, mobile Chromium, Firefox, and WebKit; two service-worker cases were intentionally skipped outside Chromium. The full runner exited successfully with code 0 when run with approved access.
- Expo Doctor: all 20 checks passed with approved network access.
- After disk space was added, Gradle built both debug and release APK variants successfully. The release APK is 66,675,254 bytes, SHA-256 `C8858DF6E4D9C4C8ED155DAE6521D58D77374BC91A2589F18B83C7D05BBD127A`, package `in.arivithai.calculator`, version `1.0.0` (code 1), min SDK 24, target SDK 36. Its merged manifest requests `INTERNET` and an app-scoped dynamic receiver permission; backup is disabled. The APK is signed with the Android debug certificate and is **not a Play Store release artifact**. An emulator started but ADB remained unauthorized, so launch and first-run behavior were not verified.
- Gradle also built a 45,105,746-byte release AAB, SHA-256 `31A00D3B5A44DBB6A35908FBD602DA4B61B17806604CDC6E0931A062C038E332`. Its signing certificate is also `CN=Android Debug`; do not upload it to Play Console.
- Added Netlify and Vercel rewrite configuration for SPA routes. The live host still needs a fresh-profile direct-link check after deployment.
- Native choice controls expose selected state to accessibility services, and navigation tabs have explicit accessible names.
- A fresh isolated emulator profile also reached ADB `unauthorized`, so no emulator install or launch claim is made. Its process was stopped. [Play Console draft](play-console-draft.md) contains listing copy and source-based declaration notes.

## Release gates still open

1. Choose the Android release lineage. The Expo and Capacitor apps both use `in.arivithai.calculator`; check Play Console for an existing app and signing key before building or changing `versionCode`.
2. Sign in to Expo/EAS (the current CLI reports `Not logged in`), produce a preview APK and production AAB using the production signing key, and inspect the final AAB permissions. The local release APK uses the debug key and cannot be uploaded as the production release.
3. Install the preview APK on a physical Android device. Complete the checks in `react-native/PLAY_RELEASE.md`, including first launch in airplane mode, force-close persistence, TalkBack, Tamil text, clipboard, screen sizes and themes.
4. Test the AAB in Play Console internal testing and collect screenshots from that build.
5. Host the web build and public privacy policy. Netlify and Vercel rewrite files are included; verify `/gst` and `/privacy-policy` in a fresh browser profile after deployment. The local plain static server returns no app for a fresh direct `/gst` visit.
6. Complete Play Console listing and declarations from the final signed artifact. Confirm package ownership, version code, and whether existing Capacitor users require data migration.
7. Verify the final hosted web URLs and rerun the checks against the deployed release build after choosing a host. Local code, browser, and Expo Doctor checks have passed.

The source is ready for release-candidate builds, but the app is **not ready for production publication** until these gates are closed.
