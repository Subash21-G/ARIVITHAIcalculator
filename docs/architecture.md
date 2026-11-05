# Architecture and phases

Angular standalone components and routes share a pure decimal calculation engine. GST and discount formulas use that engine. A versioned local storage adapter holds history and settings. English/Tamil strings are bundled. The production web build is cached by an Angular service worker and packaged locally in a Capacitor Android shell.

Current phase: 2. The Angular scaffold, route shell, responsive display and keypad are present. A pure decimal arithmetic engine now handles equals and shows controlled errors.

Next phases: 3 GST and discount; 4 storage, languages and themes; 5 PWA; 6 quality checks; 7 hosting; 8 Android; 9 store release.
