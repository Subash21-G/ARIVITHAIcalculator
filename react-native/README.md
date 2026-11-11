# ARIVITHAI React Native

Native React/Expo version of the calculator in the repository root. It includes basic arithmetic, GST, discount, local history, English/Tamil labels, themes, decimal display settings, Help, About, and Privacy screens. It uses the same decimal calculation modules as the Angular app, copied into `src/`. The translation sync script copies the web app's labels and error messages into the native project before verification.

The app uses Expo SDK 58. TypeScript checking, Android JavaScript bundling, Expo Doctor, and local Gradle APK/AAB builds have passed. The local release artifacts use an Android debug certificate and are for testing only. Device behavior and a production-signed AAB have not yet been verified; see `PLAY_RELEASE.md`.

## Run

Requires Node.js and internet access for the first dependency installation.

```powershell
cd D:\Project\calculator\react-native
npm.cmd install
npm.cmd run verify
npm.cmd start
```

Open the Expo development server on an Android device. A preview build is recommended for release testing. Native builds can use EAS cloud build without installing Android Studio or the Android SDK locally:

If Expo Go shows “Failed to download remote update”, the phone cannot fetch the development bundle. Use the [Android Expo Go build for SDK 58](https://expo.dev/go?device=true&platform=android&sdkVersion=58). Keep the phone and computer on the same trusted Wi-Fi, turn off any phone VPN, and ensure Windows permits Node.js on **Private** networks. This computer's active firewall profile was Public with inbound traffic blocked when the connection error was investigated. On a trusted home network, change that Wi-Fi connection to Private in Windows Settings, then stop the old Metro terminal with Ctrl+C, run `npm.cmd run start:clean`, and scan its new QR code. If the phone still fails, open `http://<computer-Wi-Fi-IP>:8081/status` in the phone browser. It should show `packager-status:running`.

```powershell
npm.cmd install --global eas-cli
eas login
eas build --platform android --profile preview
eas build --platform android --profile production
```

The preview profile produces an installable APK. The production profile produces an AAB for Play Console. EAS prompts to create or use an Android signing key. Check the package ID `in.arivithai.calculator` before the first Play release: it is the same ID as the existing Capacitor app, so only one of these apps can own that Play listing. Data stored in the Angular/Capacitor app does not automatically migrate to this React Native app.

See [PLAY_RELEASE.md](PLAY_RELEASE.md) for device checks, Play Console material, and remaining release decisions.
