import 'adapters/index.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import CharacterSheetLayout from './CharacterSheetLayout.jsx';
import { DiceRollToast } from './DiceRollToast.jsx';
import { SpellPickerModal } from './SpellPickerModal.jsx';
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

const LEGACY_URL = '/sheet-runtime.js';
const LUCIDE_URL = 'https://unpkg.com/lucide@0.469.0/dist/umd/lucide.min.js';
const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap';

function legacyConstToVar(code) {
  return code.replace(/^(const\s+)/gm, 'var ');
}

function injectLucideScript() {
  if (document.querySelector('script[src*="lucide"]')) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = LUCIDE_URL;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function runSheetRuntime(rawCode) {
  const transformed = legacyConstToVar(rawCode);
  const shims = `if(typeof window.__gbInstallReactSheetRendererShims==='function'){window.__gbInstallReactSheetRendererShims();}`;
  const initCode = `
C=loadChar();
if(typeof renderAll==='function')renderAll();
if(typeof loadItems==='function'){
  Promise.resolve(loadItems()).then(function(){
    try{
      if(Array.isArray(sheetInventory)){
        var d=false,sp=function(v){return String(v||'').split('|')[0];};
        sheetInventory.forEach(function(it){
          if(!it)return;
          if(it.type&&it.type.indexOf('|')>=0){it.type=sp(it.type);d=true;}
          if(Array.isArray(it.property)){
            var np=it.property.map(sp);
            if(np.some(function(p,i){return p!==it.property[i];})){it.property=np;d=true;}
          }
          if(it.custom||it.type)return;
          if(typeof _resolveInvItem==='function'){
            var e=_resolveInvItem(it);
            if(e&&e.type){it.type=sp(e.type);d=true;}
            if(e&&e.dmg1&&!it.dmg1){it.dmg1=e.dmg1;d=true;}
            if(e&&e.ac!=null&&it.ac==null){it.ac=e.ac;d=true;}
            if(e&&Array.isArray(e.property)&&!Array.isArray(it.property)){it.property=e.property.map(sp);d=true;}
          }
          if(!it.type){
            var t=(function(it2){
              if(!it2)return'';
              if(it2.dmg1){
                var pp=Array.isArray(it2.property)?it2.property:[];
                if(pp.indexOf('A')>=0||pp.indexOf('ammo')>=0||pp.indexOf('R')>=0||pp.indexOf('range')>=0)return'R';
                return'M';
              }
              if(it2.ac!=null&&it2.ac!==''){
                var an=Number(it2.ac)||0, nm=String(it2.name||'').toLowerCase();
                if(nm.indexOf('shield')>=0)return'S';
                if(an>=16)return'HA';if(an>=13)return'MA';return'LA';
              }
              return'';
            })(it);
            if(t){it.type=t;d=true;}
          }
        });
        if(d&&typeof persistInventory==='function')persistInventory();
      }
    }catch(e){console.warn('[react] inventory type backfill failed',e);}
    window.dispatchEvent(new CustomEvent('gb-sheet-snapshot-change'));
  });
}
window.adjustHpBy=function(amt,dir){hpAdjustAmt=amt;adjustHP(dir);};
window.addSpellToSheet=function(s){if(s&&s.name!=null)try{toggleSheetSpell(s.name,s.level!=null?s.level:0);}catch(e){console.warn('[sheet] addSpellToSheet failed',e);}};
if(typeof _loadSheetSpells==='function'){
  _loadSheetSpells().then(function(){if(C&&typeof renderSpellsTab==='function')renderSpellsTab();});
}
`;
  const fullCode = transformed + '\n' + shims + '\n' + initCode;

  const script = document.createElement('script');
  script.textContent = fullCode;
  document.body.appendChild(script);
  script.remove();

  document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons({ attrs: { 'stroke-width': 1.7 } });
  }
  window.__gbCharacterSheetRuntimeLoaded = true;
}

function installFonts() {
  if (document.querySelector('link[href*="fonts.googleapis.com"][href*="Cinzel"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = FONTS_URL;
  document.head.appendChild(link);
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
        if (typeof loadItems === 'function') {
          Promise.resolve(loadItems()).then(function(){
            try {
              if (Array.isArray(sheetInventory) && typeof _resolveInvItem === 'function') {
                var dirty = false;
                sheetInventory.forEach(function(it){
                  if (!it || it.custom || it.type) return;
                  var enriched = _resolveInvItem(it);
                  if (enriched && enriched.type) { it.type = enriched.type; dirty = true; }
                  if (enriched && enriched.dmg1 && !it.dmg1) { it.dmg1 = enriched.dmg1; dirty = true; }
                  if (enriched && enriched.ac != null && it.ac == null) { it.ac = enriched.ac; dirty = true; }
                  if (enriched && Array.isArray(enriched.property) && !Array.isArray(it.property)) { it.property = enriched.property.slice(); dirty = true; }
                });
                if (dirty && typeof persistInventory === 'function') persistInventory();
              }
            } catch(e) { console.warn('[react] inventory type backfill failed', e); }
            window.dispatchEvent(new CustomEvent('gb-sheet-snapshot-change'));
          });
        }
        window.adjustHpBy = function(amt, dir){ hpAdjustAmt = amt; adjustHP(dir); };
        window.addSpellToSheet = function(s){ try{ if(s&&s.name!=null) toggleSheetSpell(s.name, s.level!=null?s.level:0); }catch(e){console.warn('[sheet] addSpellToSheet',e);} };
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
    'recoverResources',
    'spendResource',
    'setResourcePip',
    'recoverResourceByKey',
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
    if (name === 'openSpellPicker') {
      window[name] = function openSpellPickerWrapper(...args) {
        if (typeof window.__gbOpenSpellPicker === 'function') {
          window.__gbOpenSpellPicker();
        }
        return undefined;
      };
      return;
    }
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
  const runtimeReadyRef = useRef(false);
  const [runtimeReady, setRuntimeReady] = useState(false);
  const [injected, setInjected] = useState(false);
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
  const [isSpellPickerOpen, setIsSpellPickerOpen] = useState(false);

  const className = useMemo(
    () => `character-sheet-page${active ? ' active' : ''}`,
    [active],
  );

  useEffect(() => {
    let cancelled = false;

    async function bootSheet() {
      try {
        installFonts();
        configureCharacterSheetScope();
        installRendererBridgeShims();
        await injectLucideScript();

        const response = await fetch(LEGACY_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const code = await response.text();

        if (cancelled) return;
        await runSheetRuntime(code);
        if (cancelled) return;

        installRendererBridgeShims();
        installSnapshotRefreshHooks();
        if (!cancelled) setInjected(true);
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Unknown error');
      }
    }

    bootSheet();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!injected || runtimeReadyRef.current) return;
    runtimeReadyRef.current = true;
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
  }, [injected]);

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
    window.__gbOpenSpellPicker = () => setIsSpellPickerOpen(true);
    return () => {
      delete window.__gbOpenSpellPicker;
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
    if (typeof window.adjustHpBy === 'function') window.adjustHpBy(safeAmount, safeDirection);
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

      {!runtimeReady && !error && (
        <div className="sheet-loading-overlay" role="status" aria-live="polite">
          <div className="sheet-loading-card">
            <div className="sheet-loading-spinner" aria-hidden="true" />
            <span>Loading character sheet…</span>
          </div>
        </div>
      )}

      {injected && (
        <div className={`character-sheet-runtime ${runtimeReady ? 'ready' : 'pending'}`}>
          <DiceRollToast />
          <SpellPickerModal
            isOpen={isSpellPickerOpen}
            onClose={() => setIsSpellPickerOpen(false)}
            onSpellSelect={(spell) => {
              if (typeof window.addSpellToSheet === 'function') {
                window.addSpellToSheet(spell);
              }
              setIsSpellPickerOpen(false);
            }}
          />
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

