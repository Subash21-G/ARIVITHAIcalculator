# Test cases and release gates

- Basic: `0.1+0.2=0.3`, `2+3*4=14`, `(2+3)*4=20`, percent examples in requirements, unary sign and parentheses.
- Errors: division by zero, malformed expression, repeated operators, empty input, excessive length, overflow.
- GST: 0%, 5%, 12%, 18% and custom rates; inclusive and exclusive; invalid or negative entries.
- Discount: percentage and fixed; 0%, 100%, negative and above-price cases.
- UI: keypad and keyboard paths, 320px width, 200% zoom, Tamil text, focus visibility, light and dark themes.
- Persistence: save, delete, clear, storage failure, reload and app restart.
- Offline: production PWA after cache; Android first launch in airplane mode.

No release until automated calculations, production build and device offline checks pass.
