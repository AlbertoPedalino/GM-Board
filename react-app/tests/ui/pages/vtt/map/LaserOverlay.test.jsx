import { render, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { vi } from 'vitest';
import LaserOverlay from '../../../../../src/pages/vtt/map/LaserOverlay.jsx';

const grid = { size: 50, offsetX: 0, offsetY: 0 };
const view = { x: 0, y: 0, zoom: 1 };

function animationClock() {
  let id = 0;
  const pending = new Map();
  vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((callback) => {
    pending.set(++id, callback);
    return id;
  });
  vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation((key) => pending.delete(key));
  return {
    pending,
    tick(now) {
      const callbacks = [...pending.values()];
      pending.clear();
      callbacks.forEach((callback) => callback(now));
    },
  };
}

function visibleSegments(trail) {
  return [...trail.querySelectorAll('line')].filter((line) => Number(line.getAttribute('opacity')) > 0);
}

test.each(['local', 'remote'])('%s laser leaves a short fading trail and cleans up animation frames', (kind) => {
  const clock = animationClock();
  const localPointRef = { current: { x: 1, y: 1 } };
  const props = {
    lasers: kind === 'remote' ? [{ id: 'player-1', x: 1, y: 1 }] : [],
    localPointRef, localActive: kind === 'local', grid, view,
  };
  const { container, rerender, unmount } = render(<LaserOverlay {...props} />);
  clock.tick(0);
  const trail = container.querySelector(`[data-laser-trail="${kind}"]`);
  expect(visibleSegments(trail)).toHaveLength(0);
  if (kind === 'local') localPointRef.current = { x: 3, y: 1 };
  else rerender(<LaserOverlay {...props} lasers={[{ id: 'player-1', x: 3, y: 1 }]} />);
  clock.tick(16);
  clock.tick(41);
  clock.tick(66);
  const segments = visibleSegments(trail);
  expect(segments.length).toBeGreaterThan(0);
  expect(segments[0].getAttribute('x1')).toBe('50');
  expect(segments.at(-1).getAttribute('x2')).toBe('150');
  const opacity = Number(segments[0].getAttribute('opacity'));
  clock.tick(120);
  expect(Number(segments[0].getAttribute('opacity'))).toBeLessThan(opacity);
  clock.tick(320);
  expect(visibleSegments(trail)).toHaveLength(0);
  expect(container.querySelector(`[data-${kind}-laser="true"]`)).toHaveStyle({ display: 'block' });
  if (kind === 'remote') expect(clock.pending.size).toBe(0);
  unmount();
  expect(clock.pending.size).toBe(0);
});

test('camera changes reproject the trail and leaving the map clears it before re-entry', () => {
  const clock = animationClock();
  const localPointRef = { current: { x: 1, y: 1 } };
  const props = { lasers: [], localPointRef, localActive: true, grid, view };
  const { container, rerender } = render(<LaserOverlay {...props} />);
  clock.tick(0);
  localPointRef.current = { x: 2, y: 1 };
  clock.tick(16);
  const trail = container.querySelector('[data-laser-trail="local"]');
  rerender(<LaserOverlay {...props} view={{ x: 20, y: 30, zoom: 2 }} />);
  clock.tick(32);
  const [segment] = visibleSegments(trail);
  expect(visibleSegments(trail)).toHaveLength(1);
  expect(segment.getAttribute('x1')).toBe('120');
  expect(segment.getAttribute('x2')).toBe('220');
  expect(segment.getAttribute('y1')).toBe('130');
  localPointRef.current = null;
  clock.tick(48);
  expect(visibleSegments(trail)).toHaveLength(0);
  expect(container.querySelector('[data-local-laser="true"]')).toHaveStyle({ display: 'none' });
  localPointRef.current = { x: 20, y: 20 };
  clock.tick(64);
  expect(visibleSegments(trail)).toHaveLength(0);
});

test('a remote laser interpolates instead of jumping to a new network position', async () => {
  const localPointRef = createRef();
  const { container, rerender } = render(
    <LaserOverlay
      lasers={[{ id: 'player-1', x: 1, y: 1, label: 'Player' }]}
      localPointRef={localPointRef}
      localActive={false}
      grid={grid}
      view={view}
    />,
  );
  const dot = container.querySelector('[data-remote-laser="true"]');
  const firstTransform = dot.style.transform;

  rerender(
    <LaserOverlay
      lasers={[{ id: 'player-1', x: 3, y: 1, label: 'Player' }]}
      localPointRef={localPointRef}
      localActive={false}
      grid={grid}
      view={view}
    />,
  );

  expect(dot.style.transform).toBe(firstTransform);
  await waitFor(() => expect(dot.style.transform).not.toBe(firstTransform));
});
