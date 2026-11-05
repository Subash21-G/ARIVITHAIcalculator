# Architecture and phases

Angular standalone components and routes share a pure decimal calculation engine. GST and discount formulas use that engine. A versioned local storage adapter holds history and settings. English/Tamil strings are bundled. The production web build is cached by an Angular service worker and packaged locally in a Capacitor Android shell.

Current phase: 4. Basic arithmetic, GST and discount calculations run locally. Completed results, language and theme are stored on this device in a versioned local schema with a 100-item history cap.

Next phases: 5 PWA; 6 quality checks; 7 hosting; 8 Android; 9 store release.
