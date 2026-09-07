import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import FogCanvas from '../../../src/pages/vtt/map/FogCanvas.jsx';
import { createFog, setCells } from '../../../src/shared/vtt/map/fog.js';

// jsdom has no raster canvas. Run these checks in a browser through Vite;
// inspect actual rendered pixels rather than mocking canvas drawing commands.
const fixture = document.getElementById('fixture');
const results = document.getElementById('results');
const root = createRoot(fixture);
const originalRatio = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio');
const reports = [];
const grid = { size: 40, offsetX: 13, offsetY: 19 };
const covered = createFog(16, 16);
let passed = 0;

function check(condition, message) {
  if (!condition) throw new Error(message);
}

function render(fog, view, opacity = 1, width = 203, height = 157) {
  flushSync(() => root.render(React.createElement('div', {
    style: { position: 'relative', width, height, background: 'magenta' },
  }, React.createElement(FogCanvas, { fog, grid, view, opacity, onTop: true }))));
  const canvas = fixture.querySelector('canvas');
  const image = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  return { canvas, image };
}

function expectUniformAlpha(image, expected) {
  for (let index = 3; index < image.data.length; index += 4) {
    check(image.data[index] === expected, `Pixel ${(index - 3) / 4}: alpha ${image.data[index]}, expected ${expected}`);
  }
}

function test(name, run) {
  try {
    run();
    reports.push(`PASS ${name}`);
    passed += 1;
  } catch (error) {
    reports.push(`FAIL ${name}: ${error.message}`);
  }
}

try {
  for (const ratio of [1, 1.25, 2]) {
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: ratio });
    for (const view of [
      { x: 0, y: 0, zoom: 1 },
      { x: 26.25, y: 12.75, zoom: 0.65 },
      { x: -71.5, y: -54.25, zoom: 2.25 },
    ]) {
      test(`covered perimeter, offsets and pan: DPR ${ratio}, zoom ${view.zoom}`, () => {
        const { image } = render(covered, view);
        expectUniformAlpha(image, 255);
        for (let index = 0; index < image.data.length; index += 4) {
          check(image.data[index] === 0 && image.data[index + 1] === 0 && image.data[index + 2] === 0, 'Covered pixels must be black');
        }
      });
    }

    test(`an old, undersized fog still hides all image borders at DPR ${ratio}`, () => {
      const { image } = render(createFog(2, 2, 1), { x: 51.5, y: 39.25, zoom: 1 });
      expectUniformAlpha(image, 255);
    });

    test(`GM opacity is uniform through the last row and column at DPR ${ratio}`, () => {
      const { image } = render(covered, { x: 0, y: 0, zoom: 1 }, 0.6);
      expectUniformAlpha(image, 153);
    });

    test(`revealed rooms stay transparent with soft edges at DPR ${ratio}`, () => {
      const cells = [];
      for (let row = 5; row <= 10; row += 1) {
        for (let col = 5; col <= 10; col += 1) cells.push({ col, row });
      }
      const fog = setCells(covered, cells, true);
      const { canvas, image } = render(fog, { x: 0, y: 0, zoom: 1 });
      const x = Math.floor((grid.offsetX + 80) * ratio);
      const y = Math.floor((grid.offsetY + 80) * ratio);
      check(image.data[(y * canvas.width + x) * 4 + 3] === 0, 'Revealed room centre is obscured');
      check(image.data[3] === 255, 'Unexplored map corner is exposed');
      check(image.data[image.data.length - 1] === 255, 'Far map corner is exposed');
      check(image.data.some((alpha, index) => index % 4 === 3 && alpha > 0 && alpha < 255), 'Revealed edge lost its softness');
    });

    test(`removing fog clears the previous coverage at DPR ${ratio}`, () => {
      const { image } = render(null, { x: 0, y: 0, zoom: 1 });
      expectUniformAlpha(image, 0);
    });
  }

  test('resizing the viewport leaves no uncovered strip', () => {
    render(covered, { x: 0, y: 0, zoom: 1 });
    const { image } = render(covered, { x: 0.25, y: 0.5, zoom: 1 }, 1, 307, 219);
    expectUniformAlpha(image, 255);
  });
} finally {
  if (originalRatio) Object.defineProperty(window, 'devicePixelRatio', originalRatio);
  results.textContent = `${reports.join('\n')}\n\n${passed}/${reports.length} passed`;
  document.body.dataset.testStatus = passed === reports.length ? 'passed' : 'failed';
}
