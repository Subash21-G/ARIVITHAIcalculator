# ARIVITHAI Play Console draft

Prepared 11 November 2026. Review against the production-signed AAB and the Play Console account before submission.

## Store listing

- App name: **ARIVITHAI Calculator**
- Short description: **Offline calculator for maths, GST and discounts in English and Tamil.**
- Full description:

  ARIVITHAI Calculator helps with everyday arithmetic, GST and discounts. Work with parentheses, percentages and decimal values. Add or remove GST, compare percentage and fixed discounts, and review recent calculations in local history.

  Choose English or Tamil, set a light or dark theme, and control decimal display. Calculations work offline and do not require an account. History and preferences stay on your device.

- Category suggestion: Tools.
- Screenshots: capture from the tested, production-signed build. Include basic calculator, GST, discount, Tamil UI, history, and settings where useful.
- Graphics: the source icon is 512 × 512 pixels. Verify Play Console acceptance and prepare any additional feature graphic requested by the console.

Google currently limits the app name to 30 characters, short description to 80, and full description to 4,000. See [Play Console listing help](https://support.google.com/googleplay/android-developer/answer/9859152).

## Declarations to review in Play Console

| Field | Source-based draft | Final check |
| --- | --- | --- |
| Ads | No ads in this source | Verify final AAB and account setup |
| Account access | No account or login | Verify final build |
| In-app purchases | None in this source | Verify final build |
| Data safety | Calculations, history and preferences are stored locally; source contains no analytics or upload code | Inspect final AAB and all included SDK behavior before answering |
| Permissions | Local merged release manifest has `INTERNET` and an app-scoped receiver permission; backup disabled | Inspect production-signed AAB manifest |
| Target audience and content rating | Developer decision | Complete Play Console questionnaires |
| Privacy policy | In-app screen exists | Publish a public URL with developer contact details |

The [Google Play policy](https://support.google.com/googleplay/android-developer/answer/18265346) requires a public privacy policy linked in Play Console and available in the app, including developer contact and data handling details. The existing in-app text needs a developer contact or inquiry mechanism before publication. The [Data safety form](https://support.google.com/googleplay/android-developer/answer/10787469) must reflect the final signed build and included SDKs.

## Account and release decisions

1. Confirm the Play Console owner of `in.arivithai.calculator` and whether a prior version exists. If so, use its signing lineage and a higher `versionCode`.
2. Sign in to Expo/EAS and configure production signing. The local APK and AAB use `CN=Android Debug` and are for testing only.
3. Add developer name, support email or inquiry mechanism, and public privacy policy URL.
4. Complete physical-device testing and Play Console internal testing before rollout. If an existing Capacitor release has users, decide how local history will migrate or communicate that it will not.
