import { useEffect, useMemo, useRef, useState } from 'react';
import CharacterSheetLayout from './CharacterSheetLayout.jsx';
import {
  configureCharacterSheetScope,
  readCharacterSheetHeader,
  writeSheetXp,
} from './characterSheetStorage.js';
import {
  computeBackground,
  computeActions,
  computeFeatures,
  computeInventory,
  computeProficiencies,
  computeSaves,
  computeScores,
  computeSenses,
  computeSkills,
  computeSpells,
  computeSummary,
  computeVitals,
} from './sheetRuntime.js';
import { loadSheetSpellDb } from './sheetSpellDb.js';

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
        content: src ? '' : (node.textContent || '').replace(
          /\nC = loadChar\(\);\s*\nrenderAll\(\);\s*\nloadItems\(\);\s*\n\/\/ Load spell DB in background so ATK\/DMG buttons and picker work immediately\s*\n_loadSheetSpells\(\)\.then\(\(\)=>\{ if\(C\) renderSpellsTab\(\); \}\);/,
          `
if (typeof window.__gbInstallReactSheetRendererShims === 'function') {
  window.__gbInstallReactSheetRendererShims();
}
C = loadChar();
if (typeof renderAll === 'function') renderAll();
if (typeof loadItems === 'function') loadItems();
if (typeof _loadSheetSpells === 'function') {
  _loadSheetSpells().then(()=>{ if(C && typeof renderSpellsTab === 'function') renderSpellsTab(); });
}`,
        ),
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
        if (typeof window.__gbInstallReactSheetRendererShims === 'function') {
          window.__gbInstallReactSheetRendererShims();
        }
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

function installRendererBridgeShims() {
  window.__gbInstallReactSheetRendererShims = function installReactSheetRendererShims() {
    if (window.__gbReactSheetRendererShimsInstalled) return;

    let installedCount = 0;
    [
      'renderTopBar',
      'renderStatsRow',
      'renderSaves',
      'renderSenses',
      'renderProficiencies',
      'renderHitDice',
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
      if (typeof window[name] !== 'function') return;
      installedCount += 1;
      window[name] = function reactRendererShim() {
        window.setTimeout(() => {
          window.dispatchEvent(new CustomEvent('gb-sheet-snapshot-change'));
        }, 0);
      };
    });

    if (installedCount > 0) window.__gbReactSheetRendererShimsInstalled = true;
  };

  window.__gbInstallReactSheetRendererShims();
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
    'updateCurrencySheet',
    'addItemToInventory',
    'addCustomItemSheet',
    'changeSheetInvQty',
    'toggleEquip',
    'toggleItemFlag',
    'setWeaponOverride',
    'toggleWeaponHand',
    'toggleVersatile',
    'toggleSlot',
    'togglePactSlot',
    'openSpellPicker',
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
  const [sheetActions, setSheetActions] = useState(() => computeActions());
  const [sheetBackground, setSheetBackground] = useState(() => computeBackground());
  const [sheetFeatures, setSheetFeatures] = useState(() => computeFeatures());
  const [sheetInventory, setSheetInventory] = useState(() => computeInventory());
  const [sheetSpells, setSheetSpells] = useState(() => computeSpells());
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
    installRendererBridgeShims();

    if (
      window.__gbCharacterSheetRuntimeLoaded ||
      (typeof window.loadChar === 'function' && typeof window.renderAll === 'function')
    ) {
      refreshLegacySheetRuntime();
      installRendererBridgeShims();
      installSnapshotRefreshHooks();
      setSheetHeader(readCharacterSheetHeader());
      setSheetSummary(computeSummary());
      setSheetVitals(computeVitals());
      setSheetScores(computeScores());
      setSheetProficiencies(computeProficiencies());
      setSheetActions(computeActions());
      setSheetBackground(computeBackground());
      setSheetFeatures(computeFeatures());
      setSheetInventory(computeInventory());
      setSheetSpells(computeSpells());
      setSheetSaves(computeSaves());
      setSheetSenses(computeSenses());
      setSheetSkillsRows(computeSkills());
      runtimeReadyRef.current = true;
      setRuntimeReady(true);
      return;
    }

    runLegacyScripts(legacyDoc.scripts)
      .then(() => {
        installRendererBridgeShims();
        installSnapshotRefreshHooks();
        setSheetHeader(readCharacterSheetHeader());
        setSheetSummary(computeSummary());
        setSheetVitals(computeVitals());
        setSheetScores(computeScores());
        setSheetProficiencies(computeProficiencies());
        setSheetActions(computeActions());
        setSheetBackground(computeBackground());
        setSheetFeatures(computeFeatures());
        setSheetInventory(computeInventory());
        setSheetSpells(computeSpells());
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
    installRendererBridgeShims();
    installSnapshotRefreshHooks();
    setSheetHeader(readCharacterSheetHeader());
    setSheetSummary(computeSummary());
    setSheetVitals(computeVitals());
    setSheetScores(computeScores());
    setSheetProficiencies(computeProficiencies());
    setSheetActions(computeActions());
    setSheetBackground(computeBackground());
    setSheetFeatures(computeFeatures());
    setSheetInventory(computeInventory());
    setSheetSpells(computeSpells());
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

  useEffect(() => {
    if (!runtimeReady) return;
    let cancelled = false;
    loadSheetSpellDb().then(() => {
      if (cancelled) return;
      setSheetSpells(computeSpells());
      setSheetActions(computeActions());
    });
    return () => {
      cancelled = true;
    };
  }, [runtimeReady]);

  function handleHeaderXpChange(nextXp) {
    const xp = writeSheetXp(nextXp);
    if (typeof window.updateXPDisplay === 'function') window.updateXPDisplay(xp);
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
    setSheetActions(computeActions());
    setSheetBackground(computeBackground());
    setSheetFeatures(computeFeatures());
    setSheetInventory(computeInventory());
    setSheetSpells(computeSpells());
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
    if (action === 'temp' && typeof window.adjustTempHP === 'function') {
      window.adjustTempHP(safeDirection);
    } else if (action === 'max' && typeof window.adjustMaxHpBonus === 'function') {
      window.adjustMaxHpBonus(safeDirection);
    }
    refreshDynamicSnapshots();
  }

  function handleDeathSaveAction(action) {
    if (action === 'roll' && typeof window.rollDeathSave === 'function') {
      window.rollDeathSave();
    } else if (action === 'reset') {
      if (typeof window.resetDeathSaves === 'function') window.resetDeathSaves();
      if (typeof window.renderStatsRow === 'function') window.renderStatsRow();
    }
    refreshDynamicSnapshots();
  }

  function handleHitDieToggle(index) {
    if (typeof window.toggleHD === 'function') window.toggleHD(index);
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
            actions={sheetActions}
            background={sheetBackground}
            features={sheetFeatures}
            inventory={sheetInventory}
            spells={sheetSpells}
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
