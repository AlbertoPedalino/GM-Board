import { useEffect, useMemo, useState } from 'react';
import { useCharbuilderContext } from './CharbuilderContext.jsx';
import InfoCard from './InfoCard.jsx';

const CLASS_ORDER = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
  'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard', 'Artificer',
];

const LEVELS = Array.from({ length: 20 }, (_, i) => i + 1);

const S = {
  base: { fontFamily: 'var(--ff-body, "EB Garamond", Georgia, serif)', color: 'var(--text, #efe6d4)', fontSize: 14 },
  panel: { background: 'var(--bg2, #1a1713)', borderRadius: 'var(--rl, 14px)', border: '1px solid var(--bdr, rgba(199, 167, 99, .2))', padding: '16px 18px', marginBottom: 14 },
  panelTitle: { fontFamily: 'var(--ff-display, Cinzel, Georgia, serif)', fontSize: 14, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--gold, #caa550)', marginBottom: 12 },
  input: { width: '100%', padding: '10px 14px', background: 'var(--bg3, #23201a)', border: '1px solid var(--bdr, rgba(199, 167, 99, .2))', borderRadius: 'var(--r, 9px)', color: 'var(--text, #efe6d4)', fontFamily: 'var(--ff-display, Cinzel, Georgia, serif)', fontSize: 16, outline: 'none', boxSizing: 'border-box' },
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  chip: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 'var(--r, 9px)', border: '1px solid var(--bdr, rgba(199, 167, 99, .2))', background: 'var(--bg3, #23201a)', color: 'var(--text2, #c4b393)', cursor: 'pointer', fontFamily: 'var(--ff-display, Cinzel, Georgia, serif)', fontSize: 12, fontWeight: 600, transition: 'all .15s', userSelect: 'none' },
  chipActive: { background: 'var(--bg5, #3a342a)', borderColor: 'var(--gold, #caa550)', color: 'var(--gold2, #edd48a)' },
  chipDisabled: { opacity: .35, cursor: 'not-allowed' },
  sourceTag: { fontSize: 9, fontWeight: 400, color: 'var(--text3, #8f7a57)', fontStyle: 'italic' },
  levelGrid: { display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4 },
  levelBtn: { padding: '8px 0', borderRadius: 'var(--r, 9px)', border: '1px solid var(--bdr, rgba(199, 167, 99, .2))', background: 'var(--bg3, #23201a)', color: 'var(--text2, #c4b393)', cursor: 'pointer', fontFamily: 'var(--ff-display, Cinzel, Georgia, serif)', fontSize: 14, fontWeight: 700, transition: 'all .15s', textAlign: 'center' },
  levelBtnActive: { background: 'var(--gold, #caa550)', borderColor: 'var(--gold, #caa550)', color: '#1a1713' },
  statRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--bdr, rgba(199, 167, 99, .2))' },
  statLabel: { color: 'var(--text2, #c4b393)', fontSize: 13 },
  statValue: { fontWeight: 700, color: 'var(--text, #efe6d4)', fontSize: 13 },
  tabBar: { display: 'flex', gap: 2, marginBottom: 10, borderBottom: '1px solid var(--bdr, rgba(199, 167, 99, .2))' },
  tab: { padding: '6px 14px', border: 'none', background: 'transparent', color: 'var(--text3, #8f7a57)', cursor: 'pointer', fontFamily: 'var(--ff-display, Cinzel, Georgia, serif)', fontSize: 11, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', borderBottom: '2px solid transparent', transition: 'all .15s' },
  tabActive: { color: 'var(--gold2, #edd48a)', borderBottomColor: 'var(--gold, #caa550)' },
  addBtn: { padding: '6px 12px', borderRadius: 'var(--r, 9px)', border: '1px dashed var(--bdr2, rgba(199, 167, 99, .42))', background: 'transparent', color: 'var(--text3, #8f7a57)', cursor: 'pointer', fontFamily: 'var(--ff-display, Cinzel, Georgia, serif)', fontSize: 10, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', transition: 'all .15s' },
  slotTable: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  slotTh: { padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid var(--bdr, rgba(199, 167, 99, .2))', color: 'var(--text3, #8f7a57)', fontFamily: 'var(--ff-display, Cinzel, Georgia, serif)', fontSize: 11, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase' },
  slotTd: { padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid var(--bdr, rgba(199, 167, 99, .2))', color: 'var(--text, #efe6d4)' },
  slotZero: { color: 'var(--text3, #8f7a57)', opacity: .4 },
  choiceBlock: { marginBottom: 12, padding: 12, background: 'var(--bg3, #23201a)', borderRadius: 'var(--r, 9px)', border: '1px solid var(--bdr, rgba(199, 167, 99, .2))' },
  choiceLabel: { fontFamily: 'var(--ff-display, Cinzel, Georgia, serif)', fontSize: 12, fontWeight: 600, color: 'var(--gold2, #edd48a)', marginBottom: 6 },
  choiceOpt: { display: 'inline-flex', padding: '4px 10px', margin: 2, borderRadius: 'var(--r, 9px)', border: '1px solid var(--bdr, rgba(199, 167, 99, .2))', background: 'var(--bg4, #2e2a22)', color: 'var(--text2, #c4b393)', cursor: 'pointer', fontSize: 12, transition: 'all .1s' },
  choiceOptActive: { background: 'var(--bg5, #3a342a)', borderColor: 'var(--gold, #caa550)', color: 'var(--gold2, #edd48a)' },
  spellTab: { padding: '4px 10px', background: 'var(--bg3, #23201a)', color: 'var(--text3, #8f7a57)', cursor: 'pointer', fontFamily: 'var(--ff-display, Cinzel, Georgia, serif)', fontSize: 11, fontWeight: 600, borderRadius: 'var(--r, 9px)', border: '1px solid var(--bdr, rgba(199, 167, 99, .2))', transition: 'all .1s' },
  spellTabActive: { background: 'var(--gold, #caa550)', color: '#1a1713', borderColor: 'var(--gold, #caa550)' },
  spellItem: { padding: '6px 10px', borderBottom: '1px solid var(--bdr, rgba(199, 167, 99, .15))', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text, #efe6d4)', transition: 'background .1s' },
  spellSelected: { background: 'var(--bg4, #2e2a22)' },
  checkbox: { width: 16, height: 16, border: '1px solid var(--bdr2, rgba(199, 167, 99, .42))', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--bg3, #23201a)', color: 'var(--gold, #caa550)', fontSize: 10, fontWeight: 700 },
  searchInput: { width: '100%', padding: '6px 10px', background: 'var(--bg3, #23201a)', border: '1px solid var(--bdr, rgba(199, 167, 99, .2))', borderRadius: 'var(--r, 9px)', color: 'var(--text, #efe6d4)', fontFamily: 'var(--ff-body, "EB Garamond", Georgia, serif)', fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 8 },
  loadingWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', color: 'var(--text3, #8f7a57)', fontSize: 14, gap: 8 },
  hidden: { display: 'none' },
  flexRow: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  sectionDesc: { color: 'var(--text2, #c4b393)', fontSize: 12, marginBottom: 10, fontStyle: 'italic' },
};

function Panel({ title, children }) {
  return (
    <div style={S.panel}>
      <div style={S.panelTitle}>
        <i data-lucide="chevron-right" class="lucide-emoji" style={{ marginRight: 6, fontSize: 10, color: 'var(--gold, #caa550)' }}></i>
        {title}
      </div>
      {children}
    </div>
  );
}

function getProfBonus(lv) {
  return Math.floor((Math.max(1, Math.min(20, Number(lv) || 1)) + 7) / 4);
}

function getConMod(ctx) {
  const method = ctx.scoreMethod || 'pointbuy';
  const scores = method === 'pointbuy' ? ctx.pbScores
    : method === 'array' ? ctx.arrAssign
    : method === 'manual' ? ctx.manualScores
    : method === 'dice' ? ctx.diceAssign
    : null;
  const base = (scores && scores.con) != null ? Number(scores.con) : 10;
  let bonus = 0;
  const sp = ctx.speciesObj;
  if (sp && Array.isArray(sp.ability)) {
    sp.ability.forEach(a => { if (a.con) bonus += Number(a.con); });
  }
  if (Array.isArray(ctx.bgAbility) && ctx.bgAbility.includes('con')) bonus += 1;
  return Math.floor((base + bonus - 10) / 2);
}

function getHp(cls, level, conMod, hpMode, manualRolls) {
  if (!cls || !cls.hd) return null;
  const faces = (typeof cls.hd === 'object' ? cls.hd.faces : parseInt(String(cls.hd || 'd8').replace(/^d/, ''), 10)) || 8;
  const lv = Math.max(1, Math.min(20, Number(level) || 1));
  let total = faces + conMod;
  if (lv > 1) {
    if (hpMode !== 'manual') {
      total += (lv - 1) * (Math.floor(faces / 2) + 1 + conMod);
    } else {
      const rolls = manualRolls || {};
      for (let i = 2; i <= lv; i++) total += Math.max(1, (Number(rolls[i]) || 0) + conMod);
    }
  }
  return total;
}

function getCasterProg(cls) {
  if (!cls) return null;
  if (cls.casterProgression) return cls.casterProgression;
  if (cls.spellcastingAbility) return 'full';
  return null;
}

function getSlots(prog, lv) {
  const p = String(prog || '').toLowerCase().trim();
  const idx = Math.min(Math.max(1, Number(lv) || 1), 20);
  const fs = window.FULL_SLOTS;
  const hs = window.HALF_SLOTS;
  const ts = window.THIRD_SLOTS;
  const ps = window.PACT_SLOTS;
  if (!fs || !hs || !ts || !ps) return null;
  if (p === 'full') return { arr: fs[idx], isPact: false };
  if (p === 'pact') return { pact: ps[idx], isPact: true };
  if (p === 'half' || p === '1/2') return { arr: hs[idx], isPact: false };
  if (p === 'artificer') return { arr: fs[Math.min(20, Math.ceil(idx / 2))], isPact: false };
  if (p === '1/3' || p === 'third') return { arr: ts[idx], isPact: false };
  return null;
}

function getMulticlassSlots(classes, classCache) {
  let totalPactLv = 0;
  let pactFound = false;
  const casterLvs = [];
  for (const cl of classes) {
    if (!cl || !cl.name) continue;
    const entry = classCache?.[cl.name];
    const cls = entry?.class || {};
    const prog = getCasterProg(cls);
    const lv = Math.min(Number(cl.level) || 0, 20);
    if (prog === 'pact') { totalPactLv = lv; pactFound = true; continue; }
    if (!prog || prog === 'none') continue;
    let contrib = 0;
    if (prog === 'full') contrib = lv;
    else if (prog === 'half' || prog === '1/2' || prog === 'artificer') contrib = Math.ceil(lv / 2);
    else if (prog === '1/3' || prog === 'third') contrib = Math.floor(lv / 3);
    casterLvs.push(contrib);
  }
  const total = casterLvs.reduce((a, b) => a + b, 0);
  const mergedIdx = Math.min(Math.max(1, total), 20);
  const slots = (window.FULL_SLOTS && window.FULL_SLOTS[mergedIdx]) || null;
  const pactSlots = pactFound && window.PACT_SLOTS ? window.PACT_SLOTS[Math.min(Math.max(1, totalPactLv), 20)] : null;
  return { mergedLevel: total, fullSlots: slots, pactSlots, pactFound };
}

function flattenFrom(arr) {
  if (!Array.isArray(arr)) return [];
  const out = [];
  for (const item of arr) {
    if (!item) continue;
    if (typeof item === 'string') out.push(item);
    else if (typeof item === 'object') {
      if (item.name) out.push(item.name);
      else if (item.type === 'skill' && item.name) out.push(item.name);
      else if (Array.isArray(item.items)) out.push(...flattenFrom(item.items));
    }
  }
  return out;
}

function extractChoices(cls, level, className) {
  const specs = [];
  try {
    const adapter = window.ClassAdapters?.[className];
    if (typeof adapter === 'function') adapter(cls, level, specs);
  } catch { /* ignore */ }
  function walk(e) {
    if (!e) return;
    if (Array.isArray(e)) { e.forEach(walk); return; }
    if (typeof e === 'object') {
      if (e.type === 'choose' && e.name && e.from) {
        if (!specs.some(s => s.key === e.name || s.label === e.name)) {
          const from = Array.isArray(e.from) ? flattenFrom(e.from) : [];
          specs.push({ key: e.name, label: e.name, type: 'choose', from, count: e.count || 1, level: 1 });
        }
      }
      if (e.type === 'entries' || e.type === 'section' || e.type === 'inset' || e.type === 'insetReadaloud') {
        if (e.entries) walk(e.entries);
      }
      if (e.entries) walk(e.entries);
    }
  }
  if (cls?.entries) walk(cls.entries);
  if (cls?.classFeatures) walk(cls.classFeatures);
  return specs.filter(s => s.level <= level);
}

function normalizeChoiceKey(label) {
  return 'choice_' + String(label || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function getSlotLevelLabel(idx) {
  return idx === 0 ? '1st' : idx === 1 ? '2nd' : idx === 2 ? '3rd' : `${idx + 1}th`;
}

export default function ClassTab() {
  const ctx = useCharbuilderContext();
  const state = ctx;
  const actions = ctx;

  const [spellTab, setSpellTab] = useState(0);
  const [spellSearch, setSpellSearch] = useState('');

  useEffect(() => { window.lucide?.createIcons({ attrs: { 'stroke-width': 2 } }); });
  useEffect(() => {
    if (!state.classCache || Object.keys(state.classCache).length === 0) actions.loadClassData?.();
  }, []);

  const conMod = useMemo(() => getConMod(ctx), [
    ctx.scoreMethod, ctx.pbScores, ctx.arrAssign, ctx.manualScores, ctx.diceAssign, ctx.speciesObj, ctx.bgAbility,
  ]);
  const pb = useMemo(() => getProfBonus(state.level), [state.level]);
  const hp = useMemo(() => getHp(state.cls, state.level, conMod, state.hpMode, state.hpManualRolls), [
    state.cls, state.level, conMod, state.hpMode, state.hpManualRolls,
  ]);
  const prog = useMemo(() => getCasterProg(state.cls), [state.cls]);
  const slots = useMemo(() => (prog ? getSlots(prog, state.level) : null), [prog, state.level]);
  const choices = useMemo(() => (state.cls ? extractChoices(state.cls, state.level, state.className) : []), [
    state.cls, state.level, state.className,
  ]);
  const mcSlots = useMemo(() => {
    const allClasses = [];
    if (state.className && state.cls) {
      allClasses.push({ name: state.className, level: state.level });
    }
    if (Array.isArray(state.extraClasses)) allClasses.push(...state.extraClasses);
    if (allClasses.length <= 1) return null;
    return getMulticlassSlots(allClasses, state.classCache);
  }, [state.className, state.cls, state.level, state.extraClasses, state.classCache]);

  const isCaster = !!(state.cls && (state.cls.spellcastingAbility || prog));
  const extraClasses = Array.isArray(state.extraClasses) ? state.extraClasses : [];
  const activeTab = state.activeClassTab ?? 0;

  const spellDb = state.spellDb || [];

  const cantripKnown = (() => {
    try {
      const cfg = window.getClassRuntimeConfig?.(state.className);
      return cfg?.spellcasting?.cantripKnown?.[state.level - 1] ?? 0;
    } catch { return 0; }
  })();

  const spellsKnown = (() => {
    try {
      const cfg = window.getClassRuntimeConfig?.(state.className);
      if (cfg?.spellcasting?.preparedMode === 'known') {
        return cfg.spellcasting.spellsKnown?.[state.level - 1] ?? 0;
      }
      return null;
    } catch { return null; }
  })();

  const preparedTotal = (() => {
    try {
      const cfg = window.getClassRuntimeConfig?.(state.className);
      if (cfg?.spellcasting?.preparedMode === 'prepared') {
        const formula = cfg.spellcasting.preparedFormula;
        if (formula) {
          const abilityMod = conMod;
          const div = formula.levelDivisor || 1;
          const rawLv = state.level / div;
          const lvTerm = formula.levelRound === 'ceil' ? Math.ceil(rawLv) : Math.floor(rawLv);
          const total = (formula.addLevel ? lvTerm : 0) + abilityMod;
          return Math.max(formula.min ?? 1, total);
        }
        return cfg.spellcasting.preparedSpellsProgression?.[state.level - 1] ?? 0;
      }
      return null;
    } catch { return null; }
  })();

  const selectedCantrips = Array.isArray(state.selectedCantrips) ? state.selectedCantrips : [];
  const selectedSpells = state.selectedSpells || {};

  const filteredByLevel = useMemo(() => {
    if (!spellDb.length) return [];
    const query = spellSearch.toLowerCase().trim();
    let pool = spellDb;
    if (spellTab === 0) {
      pool = pool.filter(s => s.level === 0);
    } else {
      pool = pool.filter(s => s.level === spellTab);
    }
    if (query) pool = pool.filter(s => s.name?.toLowerCase().includes(query));
    const classList = [state.className, ...extraClasses.map(ec => ec.name)];
    const byClass = pool.filter(s => {
      if (!s.classes) return true;
      const clsNames = Array.isArray(s.classes) ? s.classes : (typeof s.classes === 'object' ? Object.keys(s.classes) : []);
      return clsNames.some(cn => classList.includes(cn));
    });
    return byClass.length ? byClass : pool;
  }, [spellDb, spellTab, spellSearch, state.className, extraClasses]);

  // === Subcomponents ===

  function renderNamePanel() {
    return (
      <Panel title="Character Name">
        <input
          style={S.input}
          placeholder="Enter character name..."
          value={state.name || ''}
          onChange={e => actions.setCharacterName?.(e.target.value)}
        />
      </Panel>
    );
  }

  function renderClassPanel() {
    if (state.loading?.classes) {
      return (
        <Panel title="Class">
          <div style={S.loadingWrap}>
            <i data-lucide="loader-circle" class="lucide-emoji" style={{ animation: 'spin 1s linear infinite' }}></i>
            Loading classes...
          </div>
        </Panel>
      );
    }

    const cache = state.classCache || {};
    const allClasses = CLASS_ORDER.map(n => ({ name: n, loaded: !!cache[n], source: cache[n]?.class?.source || 'XPHB' }));

    return (
      <Panel title="Class">
        {extraClasses.length > 0 && (
          <div style={S.tabBar}>
            <button style={{ ...S.tab, ...(activeTab === 0 ? S.tabActive : {}) }} onClick={() => actions.switchMCTab?.(0)}>
              <i data-lucide="sword" class="lucide-emoji" style={{ marginRight: 4, fontSize: 11 }}></i>
              {state.className || 'Primary'}
            </button>
            {extraClasses.map((ec, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  style={{ ...S.tab, ...(activeTab === i + 1 ? S.tabActive : {}) }}
                  onClick={() => actions.switchMCTab?.(i + 1)}
                >
                  {ec.name}
                </button>
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--text3, #8f7a57)', cursor: 'pointer', fontSize: 12, padding: '2px 4px' }}
                  onClick={() => actions.removeExtraClass?.(i)}
                  title="Remove class"
                >
                  <i data-lucide="x" class="lucide-emoji"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={S.chipRow}>
          {allClasses.map(({ name, loaded, source }) => {
            const active = state.className === name;
            return (
              <div
                key={name}
                style={{ ...S.chip, ...(active ? S.chipActive : {}), ...(!loaded ? S.chipDisabled : {}) }}
                role="button"
                tabIndex={loaded ? 0 : -1}
                aria-disabled={!loaded}
                aria-pressed={active}
                onClick={() => { if (loaded) actions.selectClass?.(name, source); }}
                onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && loaded) { e.preventDefault(); actions.selectClass?.(name, source); } }}
              >
                <span>{name}</span>
                <span style={S.sourceTag}>{source}</span>
              </div>
            );
          })}
        </div>

        {extraClasses.length < 2 && (
          <div style={{ marginTop: 10 }}>
            <button style={S.addBtn} onClick={() => actions.addExtraClass?.()}>
              <i data-lucide="plus" class="lucide-emoji" style={{ marginRight: 4, fontSize: 10 }}></i>
              Add Multiclass
            </button>
          </div>
        )}

        {state.cls && activeTab === 0 && (
          <div style={{ marginTop: 14 }}>
            <InfoCard item={state.cls}>
              {Array.isArray(state.cls.savingThrowProfs) && state.cls.savingThrowProfs.length > 0 && (
                <div style={{ marginTop: 8, color: 'var(--text3, #8f7a57)', fontSize: 12 }}>
                  <i data-lucide="shield" class="lucide-emoji" style={{ marginRight: 4, fontSize: 11 }}></i>
                  Saves: {state.cls.savingThrowProfs.map(s => s.toUpperCase()).join(', ')}
                </div>
              )}
              {state.cls.hd && (
                <div style={{ marginTop: 4, color: 'var(--text3, #8f7a57)', fontSize: 12 }}>
                  <i data-lucide="heart" class="lucide-emoji" style={{ marginRight: 4, fontSize: 11 }}></i>
                  Hit Die: {typeof state.cls.hd === 'object' ? `1d${state.cls.hd.faces}` : (state.cls.hdText || '—')}
                </div>
              )}
            </InfoCard>
          </div>
        )}
      </Panel>
    );
  }

  function renderLevelPanel() {
    const currentLv = state.level || 1;
    return (
      <Panel title="Level & Hit Points">
        <div style={S.levelGrid}>
          {LEVELS.map(lv => (
            <div
              key={lv}
              role="button"
              tabIndex={0}
              style={{ ...S.levelBtn, ...(lv === currentLv ? S.levelBtnActive : {}) }}
              onClick={() => actions.selectLevel?.(lv)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); actions.selectLevel?.(lv); } }}
              aria-pressed={lv === currentLv}
            >
              {lv}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, background: 'var(--bg3, #23201a)', borderRadius: 'var(--r, 9px)', padding: '10px 14px' }}>
          <div style={S.statRow}>
            <span style={S.statLabel}>
              <i data-lucide="heart" class="lucide-emoji" style={{ marginRight: 4, fontSize: 12 }}></i>
              Hit Points
            </span>
            <span style={S.statValue}>{hp != null ? hp : '—'}</span>
          </div>
          <div style={S.statRow}>
            <span style={S.statLabel}>
              <i data-lucide="sword" class="lucide-emoji" style={{ marginRight: 4, fontSize: 12 }}></i>
              Proficiency Bonus
            </span>
            <span style={S.statValue}>+{pb}</span>
          </div>
          <div style={{ ...S.statRow, borderBottom: 'none' }}>
            <span style={S.statLabel}>
              <i data-lucide="activity" class="lucide-emoji" style={{ marginRight: 4, fontSize: 12 }}></i>
              CON Modifier
            </span>
            <span style={S.statValue}>{conMod >= 0 ? `+${conMod}` : conMod}</span>
          </div>
        </div>
      </Panel>
    );
  }

  function renderSubclassPanel() {
    const subs = state.subclasses || [];
    if (!subs.length) return null;
    return (
      <Panel title="Subclass">
        <div style={S.sectionDesc}>Choose a subclass (available at subclass level)</div>
        <div style={S.chipRow}>
          {subs.map(sub => {
            const active = state.subclassShortName === sub.shortName || state.subclassShortName === sub.name;
            return (
              <div
                key={sub.shortName || sub.name}
                style={{ ...S.chip, flexDirection: 'column', alignItems: 'flex-start', gap: 2, ...(active ? S.chipActive : {}) }}
                role="button"
                tabIndex={0}
                aria-pressed={active}
                onClick={() => actions.selectSubclass?.(sub.shortName || sub.name)}
                onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && active) { e.preventDefault(); actions.selectSubclass?.(sub.shortName || sub.name); } }}
              >
                <span>{sub.name}</span>
                {sub.source && <span style={S.sourceTag}>{sub.source}</span>}
              </div>
            );
          })}
        </div>
        {state.allSubFeatures?.length > 0 && (
          <div style={{ marginTop: 10 }}>
            {state.allSubFeatures.filter(f => f.level <= state.level).map((f, i) => (
              <InfoCard key={i} item={f} />
            ))}
          </div>
        )}
      </Panel>
    );
  }

  function renderSpellSlotsPanel() {
    const data = mcSlots || { fullSlots: slots?.arr || null, pactSlots: slots?.pact || null, pactFound: slots?.isPact, mergedLevel: state.level };

    if (!data) return null;

    const pactData = data.pactSlots;
    const fullData = data.fullSlots;

    if (!pactData && !fullData) return null;

    return (
      <Panel title="Spell Slots">
        {mcSlots && (
          <div style={{ color: 'var(--text3, #8f7a57)', fontSize: 12, marginBottom: 6, fontStyle: 'italic' }}>
            Multiclass caster level: {mcSlots.mergedLevel}
          </div>
        )}
        {pactData ? (
          <div style={{ background: 'var(--bg3, #23201a)', borderRadius: 'var(--r, 9px)', padding: '10px 14px' }}>
            <div style={S.statRow}>
              <span style={S.statLabel}>Pact Magic Slots</span>
              <span style={S.statValue}>{pactData.n} (Lv.{pactData.l})</span>
            </div>
          </div>
        ) : fullData ? (
          <table style={S.slotTable}>
            <thead>
              <tr>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(lv => (
                  <th key={lv} style={S.slotTh}>{getSlotLevelLabel(lv - 1)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {fullData.map((n, i) => (
                  <td key={i} style={{ ...S.slotTd, ...(n === 0 ? S.slotZero : {}) }}>{n || '—'}</td>
                ))}
                {fullData.length < 9 && Array.from({ length: 9 - fullData.length }, (_, i) => (
                  <td key={`e${i}`} style={{ ...S.slotTd, ...S.slotZero }}>—</td>
                ))}
              </tr>
            </tbody>
          </table>
        ) : null}
      </Panel>
    );
  }

  function renderChoicesPanel() {
    if (!choices.length) return null;
    return (
      <Panel title="Class Choices">
        <div style={S.sectionDesc}>Make your class feature selections</div>
        {choices.map((ch, idx) => {
          const key = ch.key || normalizeChoiceKey(ch.label);
          const current = state.choices?.[key];
          const currentArr = Array.isArray(current) ? current : (current ? [current] : []);
          const maxSelections = ch.count || 1;
          const isMulti = maxSelections > 1;
          return (
            <div key={key + idx} style={S.choiceBlock}>
              <div style={S.choiceLabel}>
                {ch.label}
                {isMulti && <span style={{ fontWeight: 400, fontSize: 10, color: 'var(--text3, #8f7a57)', marginLeft: 6 }}>(pick {maxSelections})</span>}
              </div>
              <div style={S.flexRow}>
                {ch.from && ch.from.length > 0 ? ch.from.map((opt, oi) => {
                  const selected = currentArr.includes(opt);
                  const disabled = !selected && isMulti && currentArr.length >= maxSelections;
                  return (
                    <span
                      key={oi}
                      style={{ ...S.choiceOpt, ...(selected ? S.choiceOptActive : {}), ...(disabled ? { opacity: .35, cursor: 'not-allowed' } : {}) }}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selected}
                      onClick={() => { if (!disabled || selected) actions.toggleChoice?.(key, opt); }}
                      onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && (!disabled || selected)) { e.preventDefault(); actions.toggleChoice?.(key, opt); } }}
                    >
                      {selected && <i data-lucide="check" class="lucide-emoji" style={{ fontSize: 10, marginRight: 3 }}></i>}
                      {opt}
                    </span>
                  );
                }) : (
                  <span style={{ color: 'var(--text3, #8f7a57)', fontSize: 12, fontStyle: 'italic' }}>Options loading...</span>
                )}
              </div>
            </div>
          );
        })}
      </Panel>
    );
  }

  function renderSpellsPanel() {
    return (
      <Panel title="Spells">
        {cantripKnown > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={S.choiceLabel}>
              Cantrips ({selectedCantrips.length}/{cantripKnown} known)
            </div>
            <div style={S.flexRow}>
              {filteredByLevel.filter(s => s.level === 0).slice(0, 30).map(sp => {
                const sel = selectedCantrips.includes(sp.name);
                return (
                  <span
                    key={sp.name}
                    style={{ ...S.choiceOpt, ...(sel ? S.choiceOptActive : {}), ...(cantripKnown > 0 && !sel && selectedCantrips.length >= cantripKnown ? { opacity: .35, cursor: 'not-allowed' } : {}) }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={sel}
                    onClick={() => {
                      if (sel || selectedCantrips.length < cantripKnown) actions.toggleCantrip?.(sp.name);
                    }}
                    onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && (sel || selectedCantrips.length < cantripKnown)) { e.preventDefault(); actions.toggleCantrip?.(sp.name); } }}
                  >
                    {sp.school && <span style={{ fontSize: 10, color: 'var(--text3, #8f7a57)', marginRight: 4 }}>[{sp.school}]</span>}
                    {sp.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 8 }}>
          <input
            style={S.searchInput}
            placeholder="Search spells..."
            value={spellSearch}
            onChange={e => setSpellSearch(e.target.value)}
          />
        </div>

        <div style={{ ...S.chipRow, marginBottom: 10 }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(lv => (
            <button
              key={lv}
              style={{ ...S.spellTab, ...(spellTab === lv ? S.spellTabActive : {}) }}
              onClick={() => setSpellTab(lv)}
            >
              {lv === 0 ? 'Cantrips' : `Lv.${lv}`}
            </button>
          ))}
        </div>

        {(spellsKnown != null || preparedTotal != null) && (
          <div style={{ color: 'var(--text3, #8f7a57)', fontSize: 12, marginBottom: 6, fontStyle: 'italic' }}>
            {spellsKnown != null && `${selectedSpells[spellTab]?.length || 0}/${spellsKnown} known `}
            {preparedTotal != null && `(${preparedTotal} prepared total)`}
          </div>
        )}

        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {filteredByLevel.map(sp => {
            const isCantrip = sp.level === 0;
            if (isCantrip && spellTab === 0) {
              const sel = selectedCantrips.includes(sp.name);
              return (
                <div
                  key={sp.name}
                  style={{ ...S.spellItem, ...(sel ? S.spellSelected : {}) }}
                  role="button"
                  tabIndex={0}
                  onClick={() => { if (sel || !cantripKnown || selectedCantrips.length < cantripKnown) actions.toggleCantrip?.(sp.name); }}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (sel || !cantripKnown || selectedCantrips.length < cantripKnown) actions.toggleCantrip?.(sp.name); } }}
                >
                  <span style={{ ...S.checkbox, ...(sel ? { background: 'var(--gold, #caa550)', color: '#1a1713', borderColor: 'var(--gold, #caa550)' } : {}) }}>
                    {sel ? <i data-lucide="check" class="lucide-emoji" style={{ fontSize: 10 }}></i> : null}
                  </span>
                  <span style={{ flex: 1 }}>{sp.name}</span>
                  {sp.school && <span style={{ color: 'var(--text3, #8f7a57)', fontSize: 11, fontStyle: 'italic' }}>{sp.school}</span>}
                </div>
              );
            }
            if (!isCantrip) {
              const arr = selectedSpells[spellTab] || [];
              const sel = arr.includes(sp.name);
              return (
                <div
                  key={sp.name}
                  style={{ ...S.spellItem, ...(sel ? S.spellSelected : {}) }}
                  role="button"
                  tabIndex={0}
                  onClick={() => actions.toggleSpell?.(spellTab, sp.name)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); actions.toggleSpell?.(spellTab, sp.name); } }}
                >
                  <span style={{ ...S.checkbox, ...(sel ? { background: 'var(--gold, #caa550)', color: '#1a1713', borderColor: 'var(--gold, #caa550)' } : {}) }}>
                    {sel ? <i data-lucide="check" class="lucide-emoji" style={{ fontSize: 10 }}></i> : null}
                  </span>
                  <span style={{ flex: 1 }}>{sp.name}</span>
                  {sp.school && <span style={{ color: 'var(--text3, #8f7a57)', fontSize: 11, fontStyle: 'italic' }}>{sp.school}</span>}
                </div>
              );
            }
            return null;
          })}
          {filteredByLevel.length === 0 && (
            <div style={{ color: 'var(--text3, #8f7a57)', fontSize: 13, fontStyle: 'italic', padding: '12px 0', textAlign: 'center' }}>
              No spells found
            </div>
          )}
        </div>

        {state.className === 'Wizard' && state.level >= 1 && (
          <div style={{ marginTop: 14, padding: 12, background: 'var(--bg3, #23201a)', borderRadius: 'var(--r, 9px)', border: '1px solid var(--bdr, rgba(199, 167, 99, .2))' }}>
            <div style={S.choiceLabel}>
              <i data-lucide="book" class="lucide-emoji" style={{ marginRight: 4, fontSize: 12 }}></i>
              Spellbook
            </div>
            <div style={{ color: 'var(--text2, #c4b393)', fontSize: 12, marginBottom: 6 }}>
              {Object.values(selectedSpells).flat().length + selectedCantrips.length} spells in spellbook
            </div>
          </div>
        )}
      </Panel>
    );
  }

  return (
    <div style={S.base}>
      {renderNamePanel()}
      {renderClassPanel()}
      {state.className && (
        <>
          {renderLevelPanel()}
          {renderSubclassPanel()}
          {renderSpellSlotsPanel()}
          {renderChoicesPanel()}
          {renderSpellsPanel()}
        </>
      )}
    </div>
  );
}
