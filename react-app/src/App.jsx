import { useEffect, useMemo, useState } from 'react';
import LegacyFrame from './legacy/LegacyFrame.jsx';
import CharacterSheetPage from './pages/character-sheet/CharacterSheetPage.jsx';

const ROUTES = [
  {
    path: '/',
    label: 'Home',
    page: 'index.html',
    title: 'D&D 5e - GM Board',
  },
  {
    path: '/gm-board',
    label: 'GM Board',
    page: 'gmboard.html',
    title: 'GM Board',
  },
  {
    path: '/encounter-builder',
    label: 'Encounter',
    page: 'encounter-builder.html',
    title: 'D&D 5e - Encounter Builder',
  },
  {
    path: '/character-builder',
    label: 'Builder',
    page: 'charbuilder.html',
    title: 'D&D 5e - Character Builder',
  },
  {
    path: '/character-sheet',
    label: 'Scheda',
    page: 'character-sheet.html',
    title: 'Scheda Personaggio - D&D 5e',
  },
];

const PAGE_TO_ROUTE = new Map(ROUTES.map((route) => [route.page, route.path]));
const HTML_ALIASES = new Map([
  ['/index.html', '/'],
  ['/gmboard.html', '/gm-board'],
  ['/encounter-builder.html', '/encounter-builder'],
  ['/charbuilder.html', '/character-builder'],
  ['/character-sheet.html', '/character-sheet'],
]);

function normalizePath(pathname) {
  if (HTML_ALIASES.has(pathname)) return HTML_ALIASES.get(pathname);
  return ROUTES.some((route) => route.path === pathname) ? pathname : '/';
}

export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [hasVisitedSheet, setHasVisitedSheet] = useState(path === '/character-sheet');

  const activeRoute = useMemo(
    () => ROUTES.find((route) => route.path === path) ?? ROUTES[0],
    [path],
  );

  const isCharacterSheet = activeRoute.path === '/character-sheet';

  useEffect(() => {
    function handlePopState() {
      setPath(normalizePath(window.location.pathname));
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (isCharacterSheet) setHasVisitedSheet(true);
  }, [isCharacterSheet]);

  function navigate(nextPath) {
    if (nextPath === path) return;
    window.history.pushState(null, '', nextPath);
    setPath(nextPath);
  }

  function handleLegacyNavigate(pathname, search) {
    const match = pathname.match(/\/legacy\/([^/]+)$/);
    if (!match) return;

    const nextPath = PAGE_TO_ROUTE.get(match[1]);
    if (!nextPath || nextPath === path) return;

    window.history.replaceState(null, '', `${nextPath}${search || ''}`);
    setPath(nextPath);
  }

  function handleLegacyRouteRequest(nextPath, search) {
    const normalizedPath = normalizePath(nextPath);
    if (normalizedPath === path && window.location.search === (search || '')) return;

    window.history.pushState(null, '', `${normalizedPath}${search || ''}`);
    setPath(normalizedPath);
  }

  return (
    <main className="app-shell">
      <header className="app-topbar">
        <div className="brand">
          <span className="brand-mark">GB</span>
          <div>
            <h1>GM Board React</h1>
            <p>Migrazione compatibile</p>
          </div>
        </div>
        <nav className="route-tabs" aria-label="Pagine">
          {ROUTES.map((route) => (
            <button
              key={route.path}
              type="button"
              className={route.path === activeRoute.path ? 'active' : ''}
              onClick={() => navigate(route.path)}
            >
              {route.label}
            </button>
          ))}
        </nav>
      </header>

      {!isCharacterSheet && (
        <LegacyFrame
          page={activeRoute.page}
          title={activeRoute.title}
          onLegacyNavigate={handleLegacyNavigate}
          onLegacyRouteRequest={handleLegacyRouteRequest}
        />
      )}

      {hasVisitedSheet && (
        <CharacterSheetPage active={isCharacterSheet} title="Scheda Personaggio - D&D 5e" />
      )}
    </main>
  );
}
