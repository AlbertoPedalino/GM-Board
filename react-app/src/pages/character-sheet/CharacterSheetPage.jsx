import { useEffect, useMemo, useRef, useState } from 'react';
import CharacterSheetLayout from './CharacterSheetLayout.jsx';

const LEGACY_URL = '/legacy/character-sheet.html';
const LEGACY_BASE_URL = new URL(LEGACY_URL, window.location.origin).href;

function absoluteLegacyUrl(value) {
  return new URL(value, LEGACY_BASE_URL).href;
}

function parseLegacySheet(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const headResources = [...doc.head.querySelectorAll('link, style')].map((node) => {
    if (node.tagName.toLowerCase() === 'style') {
      return {
        type: 'style',
        content: node.textContent ?? '',
      };
    }

    const attrs = {};
    for (const attr of node.attributes) {
      attrs[attr.name] = attr.name === 'href' ? absoluteLegacyUrl(attr.value) : attr.value;
    }

    return {
      type: 'link',
      attrs,
    };
  });

  const scripts = [...doc.querySelectorAll('script')].map((node) => {
    const src = node.getAttribute('src');
    return {
      src: src ? absoluteLegacyUrl(src) : null,
      type: node.getAttribute('type') || '',
      content: src ? '' : node.textContent || '',
    };
  });

  return {
    headResources,
    sections: parseCharacterSheetSections(doc),
    scripts,
  };
}

function requireNode(doc, selector) {
  const node = doc.querySelector(selector);
  if (!node) throw new Error(`Missing legacy section: ${selector}`);
  return node;
}

function parseCharacterSheetSections(doc) {
  const mainGrid = requireNode(doc, '.main-grid');
  const rightColumn = requireNode(mainGrid, '.main-col-right');

  return {
    header: requireNode(doc, '.topbar').outerHTML,
    scores: requireNode(doc, '#scores-row').outerHTML,
    stats: requireNode(doc, '#stats-row').outerHTML,
    leftColumn: requireNode(mainGrid, '.main-col-left').innerHTML,
    skillsColumn: requireNode(mainGrid, '.main-col-middle').innerHTML,
    rightSummary: requireNode(rightColumn, '.right-top-row').outerHTML,
    tabsPanel: requireNode(rightColumn, '.panel').outerHTML,
  };
}

function useLegacyHeadResources(resources, active) {
  useEffect(() => {
    if (!active || resources.length === 0) return undefined;

    const mounted = resources.map((resource) => {
      const node = document.createElement(resource.type);
      node.dataset.gmBoardLegacySheet = 'true';

      if (resource.type === 'style') {
        node.textContent = resource.content;
      } else {
        Object.entries(resource.attrs).forEach(([name, value]) => {
          node.setAttribute(name, value);
        });
      }

      document.head.appendChild(node);
      return node;
    });

    return () => mounted.forEach((node) => node.remove());
  }, [active, resources]);
}

async function runLegacyScripts(scripts) {
  for (const scriptDef of scripts) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.dataset.gmBoardLegacySheetScript = 'true';

      if (scriptDef.type) {
        script.type = scriptDef.type;
      }

      if (scriptDef.src) {
        script.src = scriptDef.src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Cannot load ${scriptDef.src}`));
      } else {
        script.textContent = scriptDef.content;
      }

      document.body.appendChild(script);
      if (!scriptDef.src) resolve();
    });
  }

  document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons({ attrs: { 'stroke-width': 1.7 } });
  }
}

export default function CharacterSheetPage({ active, title }) {
  const hasRunScriptsRef = useRef(false);
  const [legacyDoc, setLegacyDoc] = useState(null);
  const [error, setError] = useState('');

  const className = useMemo(
    () => `character-sheet-page${active ? ' active' : ''}`,
    [active],
  );

  useLegacyHeadResources(legacyDoc?.headResources ?? [], active);

  useEffect(() => {
    let cancelled = false;

    async function loadSheet() {
      try {
        const response = await fetch(`${LEGACY_URL}${window.location.search || ''}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const html = await response.text();
        const parsed = parseLegacySheet(html);
        if (!cancelled) setLegacyDoc(parsed);
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Errore sconosciuto');
      }
    }

    loadSheet();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!legacyDoc?.sections || hasRunScriptsRef.current) return;

    hasRunScriptsRef.current = true;
    runLegacyScripts(legacyDoc.scripts).catch((err) => {
      setError(err?.message || 'Errore durante inizializzazione scheda');
    });
  }, [legacyDoc]);

  return (
    <section className={className} aria-label={title} hidden={!active}>
      {error && (
        <div className="sheet-error">
          Errore caricamento scheda: {error}
        </div>
      )}

      {!legacyDoc && !error && <div className="loading-strip">Caricamento scheda</div>}

      {legacyDoc && <CharacterSheetLayout sections={legacyDoc.sections} />}
    </section>
  );
}
