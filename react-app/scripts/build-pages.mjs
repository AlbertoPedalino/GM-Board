import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { SECTION_KEYS } from '../src/shared/instances/sectionRegistry.js';

// GitHub Pages serves files, so BrowserRouter routes need their own entry page
// for direct links and refreshes. All copies use Vite's /Nat-1/ asset URLs.
const dist = new URL('../dist/', import.meta.url);
const index = new URL('index.html', dist);
const app = await readFile(new URL('../src/app/App.jsx', import.meta.url), 'utf8');
// App declares routes with literal path attributes. Expand the only parameter
// route from the same section identities used by the library pickers.
const routes = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].flatMap(([, path]) => {
  if (path === '/' || path === '*') return [];
  if (path === '/library/:tool') {
    return ['characters', ...SECTION_KEYS].map((tool) => `library/${tool}`);
  }
  if (!/^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(path)) {
    throw new Error(`Add a GitHub Pages expansion for route: ${path}`);
  }
  return [path.slice(1)];
});
if (!routes.includes('vtt')) throw new Error('Battle map route missing from the Pages build.');

for (const route of new Set(routes)) {
  const directory = new URL(`${route}/`, dist);
  await mkdir(directory, { recursive: true });
  await copyFile(index, new URL('index.html', directory));
}
// Unknown URLs still open the app's Not Found screen with a real 404 status.
await copyFile(index, new URL('404.html', dist));
console.log(`GitHub Pages: generated ${new Set(routes).size} route entry pages and 404.html.`);
