import { useEffect, useMemo, useRef, useState } from 'react';
import CharacterSheetLayout from './CharacterSheetLayout.jsx';
import {
  configureCharacterSheetScope,
  readCharacterSheetHeader,
  readCharacterSheetTabs,
  writeSheetXp,
} from './characterSheetStorage.js';
import {
  computeBackground,
  computeFeatures,
  computeProficiencies,
  computeSaves,
  computeScores,
  computeSenses,
  computeSkills,
  computeSummary,
  computeVitals,
} from './sheetRuntime.js';

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

function installSnapshotRefreshHooks() {
  if (window.__gbCharacterSheetSnapshotHooksInstalled) return;

  [
    'adjustHP',
    'adjustTempHP',
    'adjustMaxHpBonus',
    'rollDeathSave',
    'resetDeathSaves',
    'toggleHD',
    '_applyLongRest',
    '_applyShortRest',
    'renderStatsRow',
    'renderSaves',
    'renderSenses',
    'renderProficiencies',
    'renderSkills',
    'renderRightTop',
    'renderConditions',
    'renderInspirationSheet',
    'renderActionsTab',
    'renderSpellsTab',
    'renderInventoryTab',
    'renderInventoryList',
    'renderCurrency',
    'renderItemSearch',
    'renderFeaturesTab',
    'renderBackgroundTab',
  ].forEach((name) => {
    const original = window[name];
    if (typeof original !== 'function') return;
    window[name] = function snapshotRefreshWrapper(...args) {
      const result = original.apply(this, args);
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent('gb-sheet-snapshot-change'));
      }, 0);
      return result;
    };
  });

  window.__gbCharacterSheetSnapshotHooksInstalled = true;
}

export default function CharacterSheetPage({ active, title }) {
  const hasRunScriptsRef = useRef(false);
  const runtimeReadyRef = useRef(false);
  const [legacyDoc, setLegacyDoc] = useState(null);
  const [runtimeReady, setRuntimeReady] = useState(false);
  const [sheetHeader, setSheetHeader] = useState(() => readCharacterSheetHeader());
  const [sheetSummary, setSheetSummary] = useState(() => computeSummary());
  const [sheetVitals, setSheetVitals] = useState(() => computeVitals());
  const [sheetScores, setSheetScores] = useState(() => computeScores());
  const [sheetProficiencies, setSheetProficiencies] = useState(() => computeProficiencies());
  const [sheetTabs, setSheetTabs] = useState(() => readCharacterSheetTabs());
  const [sheetBackground, setSheetBackground] = useState(() => computeBackground());
  const [sheetFeatures, setSheetFeatures] = useState(() => computeFeatures());
  const [sheetSaves, setSheetSaves] = useState(() => computeSaves());
  const [sheetSenses, setSheetSenses] = useState(() => computeSenses());
  const [sheetSkillsRows, setSheetSkillsRows] = useState(() => computeSkills());
  const [activeTab, setActiveTab] = useState('actions');
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
        if (!cancelled) setError(err?.message || 'Unknown error');
      }
    }

    loadSheet();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!legacyDoc || hasRunScriptsRef.current) return;

    hasRunScriptsRef.current = true;
    setRuntimeReady(false);
    configureCharacterSheetScope();

    if (
      window.__gbCharacterSheetRuntimeLoaded ||
      (typeof window.loadChar === 'function' && typeof window.renderAll === 'function')
    ) {
      refreshLegacySheetRuntime();
      installSnapshotRefreshHooks();
      setSheetHeader(readCharacterSheetHeader());
      setSheetSummary(computeSummary());
      setSheetVitals(computeVitals());
      setSheetScores(computeScores());
      setSheetProficiencies(computeProficiencies());
      setSheetTabs(readCharacterSheetTabs());
      setSheetBackground(computeBackground());
      setSheetFeatures(computeFeatures());
      setSheetSaves(computeSaves());
      setSheetSenses(computeSenses());
      setSheetSkillsRows(computeSkills());
      runtimeReadyRef.current = true;
      setRuntimeReady(true);
      return;
    }

    runLegacyScripts(legacyDoc.scripts)
      .then(() => {
        installSnapshotRefreshHooks();
        setSheetHeader(readCharacterSheetHeader());
        setSheetSummary(computeSummary());
        setSheetVitals(computeVitals());
        setSheetScores(computeScores());
        setSheetProficiencies(computeProficiencies());
        setSheetTabs(readCharacterSheetTabs());
        setSheetBackground(computeBackground());
        setSheetFeatures(computeFeatures());
        setSheetSaves(computeSaves());
        setSheetSenses(computeSenses());
        setSheetSkillsRows(computeSkills());
        runtimeReadyRef.current = true;
        setRuntimeReady(true);
      })
      .catch((err) => {
        setError(err?.message || 'Sheet runtime initialization failed');
      });
  }, [legacyDoc]);

  useEffect(() => {
    if (!active || !runtimeReadyRef.current) return;
    refreshLegacySheetRuntime();
    installSnapshotRefreshHooks();
    setSheetHeader(readCharacterSheetHeader());
    setSheetSummary(computeSummary());
    setSheetVitals(computeVitals());
    setSheetScores(computeScores());
    setSheetProficiencies(computeProficiencies());
    setSheetTabs(readCharacterSheetTabs());
    setSheetBackground(computeBackground());
    setSheetFeatures(computeFeatures());
    setSheetSaves(computeSaves());
    setSheetSenses(computeSenses());
    setSheetSkillsRows(computeSkills());
    setRuntimeReady(true);
  }, [active]);

  useEffect(() => {
    function handleSnapshotChange() {
      refreshDynamicSnapshots();
    }

    window.addEventListener('gb-sheet-snapshot-change', handleSnapshotChange);
    return () => {
      window.removeEventListener('gb-sheet-snapshot-change', handleSnapshotChange);
    };
  }, []);

  function handleHeaderXpChange(nextXp) {
    const xp = writeSheetXp(nextXp);
    callLegacyFunction('updateXPDisplay', xp);
    setSheetHeader(readCharacterSheetHeader());
  }

  function refreshSheetSummary() {
    setSheetSummary(computeSummary());
  }

  function refreshDynamicSnapshots() {
    setSheetHeader(readCharacterSheetHeader());
    setSheetSummary(computeSummary());
    setSheetVitals(computeVitals());
    setSheetScores(computeScores());
    setSheetProficiencies(computeProficiencies());
    setSheetTabs(readCharacterSheetTabs());
    setSheetBackground(computeBackground());
    setSheetFeatures(computeFeatures());
    setSheetSaves(computeSaves());
    setSheetSenses(computeSenses());
    setSheetSkillsRows(computeSkills());
  }

  function handleHpAdjust(direction, amount) {
    const safeDirection = direction > 0 ? 1 : -1;
    const safeAmount = Math.max(1, parseInt(amount, 10) || 1);
    runLegacySheetScript(`hpAdjustAmt = ${safeAmount}; adjustHP(${safeDirection});`);
    refreshDynamicSnapshots();
  }

  function handleHpQuickAction(action, direction) {
    const safeDirection = direction > 0 ? 1 : -1;
    if (action === 'temp') {
      callLegacyFunction('adjustTempHP', safeDirection);
    } else if (action === 'max') {
      callLegacyFunction('adjustMaxHpBonus', safeDirection);
    }
    refreshDynamicSnapshots();
  }

  function handleDeathSaveAction(action) {
    if (action === 'roll') {
      callLegacyFunction('rollDeathSave');
    } else if (action === 'reset') {
      callLegacyFunction('resetDeathSaves');
      callLegacyFunction('renderStatsRow');
    }
    refreshDynamicSnapshots();
  }

  function handleHitDieToggle(index) {
    callLegacyFunction('toggleHD', index);
    refreshDynamicSnapshots();
  }

  return (
    <section className={className} aria-label={title} hidden={!active}>
      {error && (
        <div className="sheet-error">
          Sheet load error: {error}
        </div>
      )}

      {(!legacyDoc || !runtimeReady) && !error && (
        <div className="sheet-loading-overlay" role="status" aria-live="polite">
          <div className="sheet-loading-card">
            <div className="sheet-loading-spinner" aria-hidden="true" />
            <span>Loading character sheet…</span>
          </div>
        </div>
      )}

      {legacyDoc && (
        <div className={`character-sheet-runtime ${runtimeReady ? 'ready' : 'pending'}`}>
          <CharacterSheetLayout
            header={sheetHeader}
            summary={sheetSummary}
            vitals={sheetVitals}
            scores={sheetScores}
            proficiencies={sheetProficiencies}
            tabs={sheetTabs}
            background={sheetBackground}
            features={sheetFeatures}
            saves={sheetSaves}
            senses={sheetSenses}
            skills={sheetSkillsRows}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onHeaderXpChange={handleHeaderXpChange}
            onSummaryRefresh={refreshSheetSummary}
            onRuntimeRefresh={refreshDynamicSnapshots}
            onHpAdjust={handleHpAdjust}
            onHpQuickAction={handleHpQuickAction}
            onDeathSaveAction={handleDeathSaveAction}
            onHitDieToggle={handleHitDieToggle}
          />
        </div>
      )}
    </section>
  );
}

function callLegacyFunction(name, ...args) {
  const script = document.createElement('script');
  script.dataset.gmBoardLegacySheetCall = 'true';
  script.textContent = `
    try {
      if (typeof ${name} === 'function') ${name}.apply(null, ${JSON.stringify(args)});
    } catch (err) {
      console.error('Legacy call failed: ${name}', err);
    }
  `;
  document.body.appendChild(script);
  script.remove();
}

function runLegacySheetScript(source) {
  const script = document.createElement('script');
  script.dataset.gmBoardLegacySheetCall = 'true';
  script.textContent = `
    try {
      ${source}
    } catch (err) {
      console.error('Legacy sheet script failed', err);
    }
  `;
  document.body.appendChild(script);
  script.remove();
}
