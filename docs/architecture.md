# Architecture and phases

Angular standalone components and routes share a pure decimal calculation engine. GST and discount formulas use that engine. A versioned local storage adapter holds history and settings. English/Tamil strings are bundled. The production web build is cached by an Angular service worker and packaged locally in a Capacitor Android shell.

Current phase: 5. Angular's production service worker precaches the application shell, scripts, manifest and icons. Browser history and settings remain in local storage while the calculator works offline after its first complete online load.

Next phases: 6 quality checks; 7 hosting; 8 Android; 9 store release.
