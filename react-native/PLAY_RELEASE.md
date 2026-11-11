# Play Store release preparation

## Build state

The project uses Expo SDK 58 and Android application ID `in.arivithai.calculator`. The release configuration builds an Android App Bundle (AAB). App data is excluded from Android backup. The local merged release manifest requests `INTERNET` and an app-scoped dynamic receiver permission. Calculation code uses no network API. TypeScript, Android JavaScript export, all 20 Expo Doctor checks, and local APK/AAB builds passed on November 11, 2026. The local release artifacts are signed with the Android debug certificate and must not be uploaded to Play Console. No Expo account is logged in on this machine, so a production-signed build has not been produced.

Run the local code checks before each release:

```powershell
cd D:\Project\calculator\react-native
npm.cmd ci
$env:EXPO_NO_TELEMETRY='1'
npm.cmd run verify
npx.cmd expo-doctor@latest
```

To build with Expo Application Services, sign in to an Expo account and run:

```powershell
npx.cmd eas-cli@latest login
npx.cmd eas-cli@latest build --platform android --profile preview
npx.cmd eas-cli@latest build --platform android --profile production
```

The preview build is an APK for device testing. The production build is a signed AAB after EAS signing credentials are configured. Keep the upload key or EAS credential access secure. Do not commit keystores or credentials.

## Required device checks

Install the preview APK on a physical Android device. Check small and large screens, light and dark system themes, Tamil text, offline launch, clipboard, and history persistence after force-close. Check basic arithmetic including parentheses, `%`, divide-by-zero, and negative numbers; GST inclusive/exclusive; discount percentage/fixed; clear/delete history; and screen-reader labels. Capture screenshots from the tested release build for the Play listing. Test the production AAB through Play Console internal testing before production rollout.

## Play Console information

The app has no account, ads, analytics, or in-app purchases in this source. Calculations and preferences use local AsyncStorage. Confirm the final AAB's merged permissions and included SDK behavior before completing Data safety. Play Console still needs the store listing, screenshots, content rating, target audience, app access, ads declaration, Data safety form, and a **public privacy policy URL**. The in-app privacy screen is present, but the public URL depends on where the website is hosted.

Suggested short description: “Offline calculator for everyday maths, GST and discounts in English and Tamil.”

Suggested full description: “ARIVITHAI Calculator helps with everyday arithmetic, GST and discounts. Calculate with parentheses and percentages, add or remove GST, and compare percentage or fixed discounts. See a local history of completed calculations and choose English or Tamil, a light or dark theme, and decimal display preferences. The calculator works offline and does not require an account.”

## Decisions before first upload

- Confirm whether `in.arivithai.calculator` already exists in Play Console. This React Native project and the older Capacitor project share that ID. Only one release lineage can use it; an update must use the existing app's signing setup and a higher version code.
- Publish the website privacy page at a stable public URL and place that URL in Play Console. Verify the policy names the app or developer and reflects the final AAB.
- Set `android.versionCode` higher than every previously uploaded bundle before an update. Increase `expo.version` for the user-facing release version.
- History from the Angular/Capacitor app is not migrated into the React Native app. Decide whether an existing user base needs migration before replacing its package.
