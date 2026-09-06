# Tests

The test trees mirror `src/`, keeping the same feature and module folders:

- `logic/`: Node test runner suites (`*.test.js`), without a DOM.
- `ui/`: Vitest and jsdom suites (`*.test.jsx`), for components and hooks.
- `setup.js`: shared UI setup and cleanup.

Run commands from `react-app/`:

```sh
npm test
npm run test:logic
npm run test:ui
```

Run a single suite:

```sh
node --test tests/logic/shared/vtt/fog.test.js
npm run test:ui -- tests/ui/pages/vtt/components/SceneViewport.test.jsx
```

Imports and mocks refer directly to the corresponding modules in `src/`.
