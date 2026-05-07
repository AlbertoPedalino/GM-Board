import { useEffect, useMemo, useRef, useState } from 'react';
import CharacterSheetLayout from './CharacterSheetLayout.jsx';

const LEGACY_URL = '/legacy/character-sheet.html';
const LEGACY_BASE_URL = new URL(LEGACY_URL, window.location.origin).href;
const SHEET_KEYS = [
  '5e_current_char',
  '5e_inventory',
  '5e_currency',
  '5e_xp',
  '5e_hp_current',
  '5e_hp_temp',
  '5e_hp_max_bonus',
  '5e_death_saves',
  '5e_conditions_active',
  '5e_hd_used',
  '5e_slots_used',
  '5e_notes',
  '5e_skill_adv',
  '5e_resources',
  '5e_builder_state',
  '5e_inspiration',
];

function absoluteLegacyUrl(value) {
  return new URL(value, LEGACY_BASE_URL).href;
}

function cleanCharacterId(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 48);
}

function configureCharacterSheetScope() {
  if (!window.__gbRawStorage) {
    window.__gbRawStorage = {
      getItem: Storage.prototype.getItem,
      setItem: Storage.prototype.setItem,
      removeItem: Storage.prototype.removeItem,
    };
  }

  const raw = window.__gbRawStorage;
  const params = new URLSearchParams(window.location.search);
  let id = cleanCharacterId(params.get('char'));

  if (id === 'new') {
    id = `pc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
    window.history.replaceState(null, '', `${window.location.pathname}?char=${encodeURIComponent(id)}`);
  }

  if (!id) {
    id = cleanCharacterId(raw.getItem.call(localStorage, 'gb_active_char_id')) || 'default';
  }

  raw.setItem.call(localStorage, 'gb_active_char_id', id);
  window.GB_CHAR_ID = id;
  window.GB_SHEET_KEYS = SHEET_KEYS;
  window.__gbCharacterSheetCharId = id;
  window.gbScopedHref = (page) => `${page}?char=${encodeURIComponent(window.__gbCharacterSheetCharId || id)}`;
  window.gbRegisterCharScope = function gbRegisterCharScope(label) {
    const currentId = window.__gbCharacterSheetCharId || id;
    const rawRegistry = raw.getItem.call(localStorage, 'gb_char_registry') || '[]';
    let list = [];
    try {
      list = JSON.parse(rawRegistry);
    } catch {
      list = [];
    }

    const now = Date.now();
    const existing = list.find((entry) => entry && entry.id === currentId);
    const name = (existing && existing.name) || String(label || '').trim() || currentId;
    list = [
      { id: currentId, name, updatedAt: now },
      ...list.filter((entry) => entry && entry.id !== currentId),
    ].slice(0, 20);
    raw.setItem.call(localStorage, 'gb_char_registry', JSON.stringify(list));
  };

  if (!window.__gbCharacterSheetStoragePatched) {
    const scopedKeys = new Set(SHEET_KEYS);
    const scoped = (key) => {
      const keyName = String(key || '');
      const currentId = window.__gbCharacterSheetCharId || 'default';
      return scopedKeys.has(keyName) ? `gb:char:${currentId}:${keyName}` : key;
    };

    Storage.prototype.getItem = function getItem(key) {
      return raw.getItem.call(this, scoped(key));
    };
    Storage.prototype.setItem = function setItem(key, value) {
      return raw.setItem.call(this, scoped(key), value);
    };
    Storage.prototype.removeItem = function removeItem(key) {
      return raw.removeItem.call(this, scoped(key));
    };
    window.__gbCharacterSheetStoragePatched = true;
  }
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

  const scripts = [...doc.querySelectorAll('script')]
    .filter((node) => {
      const content = node.textContent || '';
      return !(
        !node.getAttribute('src') &&
        content.includes('window.GB_SHEET_KEYS') &&
        content.includes('Storage.prototype.getItem')
      );
    })
    .map((node) => {
      const src = node.getAttribute('src');
      if (src && src.replaceAll('\\', '/').endsWith('adapters/loader.js')) {
        return {
          loadAdapterManifest: true,
          src: null,
          type: '',
          content: '',
        };
      }

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
    if (scriptDef.loadAdapterManifest) {
      await loadAdapterManifestScripts();
      continue;
    }

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

  window.__gbCharacterSheetRuntimeLoaded = true;
}

async function loadAdapterManifestScripts() {
  await new Promise((resolve, reject) => {
    delete window.__gbAdapterManifestError;

    const script = document.createElement('script');
    script.dataset.gmBoardLegacySheetScript = 'true';
    script.textContent = `
      try {
        window.__gbAdapterManifest = Array.isArray(ADAPTER_MANIFEST)
          ? ADAPTER_MANIFEST.slice()
          : [];
      } catch (err) {
        window.__gbAdapterManifestError = err && err.message ? err.message : String(err);
      }
    `;
    document.body.appendChild(script);
    script.remove();

    if (window.__gbAdapterManifestError) {
      reject(new Error(window.__gbAdapterManifestError));
      return;
    }

    resolve();
  });

  const manifest = Array.isArray(window.__gbAdapterManifest)
    ? window.__gbAdapterManifest
    : [];

  for (const path of manifest) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.dataset.gmBoardLegacySheetScript = 'true';
      script.src = absoluteLegacyUrl(path);
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Cannot load adapter ${path}`));
      document.body.appendChild(script);
    });
  }
}

function refreshLegacySheetRuntime() {
  configureCharacterSheetScope();

  const script = document.createElement('script');
  script.dataset.gmBoardLegacySheetRefresh = 'true';
  script.textContent = `
    (function(){
      try {
        if (typeof loadChar !== 'function' || typeof renderAll !== 'function') return;
        C = loadChar();
        renderAll();
        if (typeof loadItems === 'function') loadItems();
        if (typeof _loadSheetSpells === 'function') {
          _loadSheetSpells().then(function(){
            if (C && typeof renderSpellsTab === 'function') renderSpellsTab();
          });
        }
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons({ attrs: { 'stroke-width': 1.7 } });
        }
      } catch (err) {
        console.error('Character sheet refresh failed', err);
      }
    })();
  `;
  document.body.appendChild(script);
  script.remove();
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
    configureCharacterSheetScope();

    if (
      window.__gbCharacterSheetRuntimeLoaded ||
      (typeof window.loadChar === 'function' && typeof window.renderAll === 'function')
    ) {
      refreshLegacySheetRuntime();
      return;
    }

    runLegacyScripts(legacyDoc.scripts).catch((err) => {
      setError(err?.message || 'Errore durante inizializzazione scheda');
    });
  }, [legacyDoc]);

  useEffect(() => {
    if (!active || !hasRunScriptsRef.current) return;
    refreshLegacySheetRuntime();
  }, [active]);

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
