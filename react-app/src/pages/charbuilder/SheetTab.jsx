import { useMemo } from 'react';
import { useCharbuilderContext } from './CharbuilderContext.jsx';

const STATS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const STAT_LABELS = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };

const S = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: 16,
    color: '#efe6d4',
    fontFamily: '"EB Garamond", Georgia, serif',
    fontSize: 14,
    overflowY: 'auto',
    height: '100%',
  },
  card: {
    background: '#23201a',
    border: '1px solid rgba(199,167,99,.2)',
    borderRadius: 9,
    padding: '14px 16px',
  },
  hdr: {
    fontFamily: 'Cinzel, Georgia, serif',
    fontSize: 20,
    fontWeight: 700,
    color: '#caa550',
    margin: 0,
  },
  sub: {
    fontSize: 13,
    color: '#c4b393',
    lineHeight: 1.4,
    margin: 0,
  },
  sectionTitle: {
    fontFamily: 'Cinzel, Georgia, serif',
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '.08em',
    color: '#edd48a',
    marginBottom: 10,
    paddingBottom: 4,
    borderBottom: '1px solid rgba(199,167,99,.2)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 0',
    borderBottom: '1px solid rgba(199,167,99,.1)',
    fontSize: 14,
    lineHeight: 1.4,
  },
  summaryLabel: {
    color: '#8f7a57',
  },
  summaryValue: {
    color: '#edd48a',
    fontWeight: 600,
    textAlign: 'right',
  },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '5px 0',
    borderBottom: '1px solid rgba(199,167,99,.08)',
    fontSize: 13,
  },
  checkIcon: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 700,
    flexShrink: 0,
  },
  checkLabel: {
    flex: 1,
    color: '#c4b393',
  },
  checkDetail: {
    fontSize: 12,
    color: '#8f7a57',
    fontStyle: 'italic',
  },
  btn: {
    width: '100%',
    padding: '12px 20px',
    borderRadius: 8,
    border: 'none',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'Cinzel, Georgia, serif',
    letterSpacing: '.02em',
    transition: 'opacity .15s',
  },
  btnActive: {
    background: '#caa550',
    color: '#1a1713',
  },
  btnDisabled: {
    background: '#3a3528',
    color: '#8f7a57',
    cursor: 'not-allowed',
  },
  link: {
    color: '#c4b393',
    fontSize: 13,
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  scoreGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: 4,
    marginTop: 6,
  },
  scoreMini: {
    textAlign: 'center',
    padding: '3px 0',
    borderRadius: 4,
    background: '#1a1713',
    border: '1px solid rgba(199,167,99,.15)',
  },
  scoreLabel: {
    fontFamily: 'Cinzel, Georgia, serif',
    fontSize: 9,
    letterSpacing: '.05em',
    color: '#8f7a57',
    textTransform: 'uppercase',
  },
  scoreVal: {
    fontSize: 16,
    fontWeight: 700,
    color: '#efe6d4',
  },
};

function getBaseScores(char) {
  const method = char.scoreMethod || 'pointbuy';
  if (method === 'pointbuy') return char.pbScores || {};
  if (method === 'array') return char.arrAssign || {};
  if (method === 'manual') return char.manualScores || {};
  if (method === 'dice') return char.diceAssign || {};
  return {};
}

function getSpeciesBonuses(sp) {
  const out = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  if (!sp) return out;
  const abil = sp.ability || [];
  for (const entry of abil) {
    for (const s of STATS) {
      if (entry[s] != null) out[s] += Number(entry[s]);
    }
  }
  return out;
}

function getBgBonuses(bgObj, bgAbility) {
  const out = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  if (!bgObj) return out;
  const arr = Array.isArray(bgAbility) && bgAbility.length === 2 ? bgAbility : [];
  for (const s of arr) {
    if (s) out[s] = (out[s] || 0) + 1;
  }
  return out;
}

function computeFinalScores(char) {
  const base = getBaseScores(char);
  const species = getSpeciesBonuses(char.speciesObj);
  const bg = getBgBonuses(char.bgObj, char.bgAbility);
  const out = {};
  for (const s of STATS) {
    out[s] = (Number(base[s]) || 10) + (species[s] || 0) + (bg[s] || 0);
  }
  return out;
}

function getMod(val) {
  return Math.floor(((Number(val) || 10) - 10) / 2);
}

function modStr(val) {
  const m = getMod(val);
  return m >= 0 ? '+' + m : String(m);
}

export default function SheetTab() {
  const { state, actions } = useCharbuilderContext();
  const char = state.char;

  const checks = useMemo(() => {
    const c = [];
    c.push({
      key: 'name',
      label: 'Character Name',
      ok: !!char.name?.trim(),
      detail: char.name?.trim() || 'Not set',
    });
    c.push({
      key: 'class',
      label: 'Class',
      ok: !!char.className,
      detail: char.className ? char.className + ' ' + char.level : 'Not selected',
    });
    c.push({
      key: 'species',
      label: 'Species',
      ok: !!char.speciesName,
      detail: char.speciesName || 'Not selected',
    });
    c.push({
      key: 'background',
      label: 'Background',
      ok: !!char.bgName,
      detail: char.bgName || 'Not selected',
    });
    c.push({
      key: 'scores',
      label: 'Ability Scores',
      ok: char.scoreMethod === 'pointbuy'
        ? Object.values(char.pbScores || {}).reduce((s, v) => s + v, 0) > 8 * 6
        : char.scoreMethod === 'array'
          ? Object.values(char.arrAssign || {}).filter(v => v !== null && v !== undefined).length >= 6
          : char.scoreMethod === 'dice'
            ? Object.values(char.diceAssign || {}).filter(v => v !== null && v !== undefined).length >= 6
            : char.scoreMethod === 'manual'
              ? true
              : false,
      detail: 'Using ' + (char.scoreMethod || 'pointbuy'),
    });
    const featCount = char.choices
      ? Object.keys(char.choices).filter(k => k.startsWith('feat_') && char.choices[k] === true).length
      : 0;
    c.push({
      key: 'feats',
      label: 'Feats & ASI',
      ok: true,
      detail: featCount > 0 ? featCount + ' feat(s) selected' : 'None selected (optional)',
    });
    c.push({
      key: 'equipment',
      label: 'Equipment',
      ok: true,
      detail: (char.inventory?.length || 0) + ' item(s)',
    });
    const cantripCount = char.selectedCantrips?.length || 0;
    const spellCount = Object.values(char.selectedSpells || {}).reduce((s, arr) => s + (Array.isArray(arr) ? arr.length : 0), 0);
    c.push({
      key: 'spells',
      label: 'Spells',
      ok: true,
      detail: cantripCount + spellCount > 0 ? cantripCount + ' cantrip(s), ' + spellCount + ' spell(s)' : 'None (optional)',
    });
    return c;
  }, [char]);

  const missing = useMemo(() => checks.filter(c => !c.ok), [checks]);
  const allDone = missing.length === 0;
  const scores = useMemo(() => computeFinalScores(char), [char]);

  const metaParts = [];
  if (char.className) metaParts.push(char.className + ' ' + char.level);
  if (char.speciesName) metaParts.push(char.speciesName);
  if (char.bgName) metaParts.push(char.bgName);

  function handleGenerate() {
    actions.saveAndOpenSheet();
  }

  function goHome() {
    const target = '/';
    if (target !== window.location.pathname + window.location.search) {
      window.history.pushState(null, '', target);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  return (
    <div style={S.wrap}>
      <h2 style={S.hdr}>Generate Character Sheet</h2>
      <p style={S.sub}>Review your character and generate a printable sheet.</p>

      <div style={S.card}>
        <div style={S.sectionTitle}>Character Summary</div>
        <div style={S.summaryRow}>
          <span style={S.summaryLabel}>Name</span>
          <span style={S.summaryValue}>{char.name?.trim() || 'Unnamed Hero'}</span>
        </div>
        <div style={S.summaryRow}>
          <span style={S.summaryLabel}>Class &amp; Level</span>
          <span style={S.summaryValue}>{metaParts[0] || '\u2014'}</span>
        </div>
        <div style={S.summaryRow}>
          <span style={S.summaryLabel}>Species</span>
          <span style={S.summaryValue}>{char.speciesName || '\u2014'}</span>
        </div>
        <div style={S.summaryRow}>
          <span style={S.summaryLabel}>Background</span>
          <span style={S.summaryValue}>{char.bgName || '\u2014'}</span>
        </div>
        <div style={S.summaryRow}>
          <span style={S.summaryLabel}>Subclass</span>
          <span style={S.summaryValue}>{char.subclassShortName || '\u2014'}</span>
        </div>
        <div style={{ marginTop: 8 }}>
          <div style={S.scoreGrid}>
            {STATS.map(s => (
              <div key={s} style={S.scoreMini}>
                <div style={S.scoreLabel}>{STAT_LABELS[s]}</div>
                <div style={S.scoreVal}>{scores[s]}</div>
                <div style={{ fontSize: 10, color: '#8f7a57' }}>{modStr(scores[s])}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.sectionTitle}>Completion Status</div>
        {checks.map(c => (
          <div key={c.key} style={S.checkRow}>
            <div
              style={{
                ...S.checkIcon,
                background: c.ok ? 'rgba(63,166,108,.2)' : 'rgba(192,57,43,.2)',
                color: c.ok ? '#3fa66c' : '#c0392b',
              }}
            >
              {c.ok ? '\u2714' : '\u2716'}
            </div>
            <span style={S.checkLabel}>{c.label}</span>
            <span style={S.checkDetail}>{c.detail}</span>
          </div>
        ))}
        {missing.length > 0 && (
          <div style={{ marginTop: 8, fontSize: 13, color: '#c0392b', fontStyle: 'italic' }}>
            {missing.length} section{missing.length !== 1 ? 's' : ''} incomplete
          </div>
        )}
      </div>

      <button
        style={{
          ...S.btn,
          ...(char.className ? S.btnActive : S.btnDisabled),
        }}
        disabled={!char.className}
        onClick={handleGenerate}
        aria-label="Generate character sheet"
      >
        {char.className ? 'Generate Character Sheet' : 'Select a Class First'}
      </button>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <span
          style={S.link}
          role="button"
          tabIndex={0}
          onClick={goHome}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goHome(); } }}
        >
          &larr; Back to Home
        </span>
      </div>
    </div>
  );
}
