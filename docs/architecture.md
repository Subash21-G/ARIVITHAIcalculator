# Architecture and phases

Angular standalone components and routes share a pure decimal calculation engine. GST and discount formulas use that engine. A versioned local storage adapter holds history and settings. English/Tamil strings are bundled. The production web build is cached by an Angular service worker and packaged locally in a Capacitor Android shell.

Current phase: 3. Basic arithmetic, GST and discount calculations run locally with decimal arithmetic. GST and discount forms show validated breakdowns and copyable results.

Next phases: 4 storage, languages and themes; 5 PWA; 6 quality checks; 7 hosting; 8 Android; 9 store release.
