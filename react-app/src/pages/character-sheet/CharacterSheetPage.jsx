import { useEffect, useMemo, useRef, useState } from 'react';

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

  const body = doc.body.cloneNode(true);
  body.querySelectorAll('script').forEach((script) => script.remove());

  return {
    bodyHtml: body.innerHTML,
    headResources,
    scripts,
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
  const rootRef = useRef(null);
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
    if (!legacyDoc?.bodyHtml || hasRunScriptsRef.current) return;

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

      {legacyDoc && (
        <div
          ref={rootRef}
          className="character-sheet-root"
          dangerouslySetInnerHTML={{ __html: legacyDoc.bodyHtml }}
        />
      )}
    </section>
  );
}
