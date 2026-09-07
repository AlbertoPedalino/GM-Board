# Tests

The test trees mirror `src/`, keeping the same feature and module folders:

- `logic/`: Node test runner suites (`*.test.js`), without a DOM.
- `ui/`: Vitest and jsdom suites (`*.test.jsx`), for components and hooks.
- `setup.js`: shared UI setup and cleanup.
- `browser/`: real-browser pixel checks for rendering that jsdom cannot rasterize.

Run commands from `react-app/`:

```sh
npm test
npm run test:logic
npm run test:ui
```

Run a single suite:

```sh
node --test tests/logic/shared/vtt/map/fog.test.js
npm run test:ui -- tests/ui/pages/vtt/map/SceneViewport.test.jsx
```

Imports and mocks refer directly to the corresponding modules in `src/`.

For fog canvas pixel regressions, start `npm run dev` and open
`http://127.0.0.1:5173/Nat-1/tests/browser/vtt/fog.html`. The page reports pass/fail
for map borders, offsets, zoom/pan, old fog sizes, fractional device pixel ratios,
GM opacity, revealed areas, disabling fog, and resizing. These browser checks
are separate from `npm test`.
