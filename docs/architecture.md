# Architecture and phases

Angular standalone components and routes share a pure decimal calculation engine. GST and discount formulas use that engine. A versioned local storage adapter holds history and settings. English/Tamil strings are bundled. The production web build is cached by an Angular service worker and packaged locally in a Capacitor Android shell.

Current phase: 1. The Angular scaffold, route shell, responsive display and keypad are present. Equals is disabled until the safe math engine is implemented in Phase 2.

Next phases: 2 arithmetic and tests; 3 GST and discount; 4 storage, languages and themes; 5 PWA; 6 quality checks; 7 hosting; 8 Android; 9 store release.
