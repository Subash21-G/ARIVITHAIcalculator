# ARIVITHAI React Native

Native React/Expo version of the calculator in the repository root. It includes basic arithmetic, GST, discount, local history, English/Tamil labels, themes, decimal display settings, Help, About, and Privacy screens. It uses the same decimal calculation modules as the Angular app, copied into `src/`. The translation sync script copies the web app's labels and error messages into the native project before verification.

The app uses Expo SDK 58. TypeScript checking, Android JavaScript bundling, Expo Doctor, and local Gradle APK/AAB builds have passed. The local release artifacts use an Android debug certificate and are for testing only. Device behavior and a production-signed AAB have not yet been verified; see `PLAY_RELEASE.md`.

## Run

Requires Node.js and internet access for the first dependency installation.

### Install on a physical Android phone (recommended)

Expo Go loads a development bundle over the network, so it can show `Failed to download remote update` when the phone cannot reach the computer. For normal phone use, install a standalone APK instead. It includes the JavaScript bundle and works without Expo Go, Metro, or a Wi-Fi connection.

Build a test APK locally with Android Studio's SDK installed:

```powershell
cd D:\Project\calculator\react-native
npm.cmd ci
$env:ANDROID_HOME = Join-Path $env:LOCALAPPDATA 'Android\Sdk'
$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'
cd android
.\gradlew.bat assembleRelease
```

Copy `android\app\build\outputs\apk\release\app-release.apk` to the phone and open it to install. Android may ask you to allow installation from your file manager. This local APK uses the project's debug signing key and is for device testing; use the EAS preview/production builds below for distribution. If an already installed app with package ID `in.arivithai.calculator` has a different signing key, uninstall that app before installing this test APK; uninstalling can erase its local history and settings.

### Develop with Expo Go

```powershell
cd D:\Project\calculator\react-native
npm.cmd install
npm.cmd run verify
npm.cmd start
```

To open the app on the local Android emulator, run `npm.cmd run android`. This command locates the Windows Android SDK and AVD directory automatically and restarts ADB if a connected emulator is unauthorized. Keep the terminal open while using the debug app.

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
