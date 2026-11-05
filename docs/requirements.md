# V1 requirements

ARIVITHAI Calculator will be a responsive Angular website, offline PWA and bundled Android app. It must support decimal-safe arithmetic, parentheses and percent, GST and discount tools, local history, English and Tamil, and light/dark/system themes. No account, backend, runtime API or mandatory ads.

Percent semantics: `200+10% = 220`, `200-10% = 180`, `200*10% = 20`, `200/10% = 2000`, and `10% = 0.1`.

GST uses a user-entered rate. Fixed discounts above the original price are rejected. Currency values display two decimal places while internal values retain decimal precision. Calculations and settings stay on the device.

The web PWA must work offline after a complete first online load. The Android bundle must work on its first launch in airplane mode.
