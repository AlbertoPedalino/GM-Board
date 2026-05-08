import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const STATS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const STAT_LABELS = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };

const S = {
  sidebar: {
    background: 'var(--bg2, #1a1713)',
    border: '1px solid var(--bdr, rgba(199, 167, 99, .2))',
    borderRadius: 'var(--rl, 14px)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: 'var(--ff-body, "EB Garamond", Georgia, serif)',
    color: 'var(--text, #efe6d4)',
    fontSize: 14,
    boxShadow: '0 8px 24px rgba(0,0,0,.26)',
    position: 'sticky',
    top: '1rem',
    maxHeight: '90vh',
  },
  scroll: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem 1.15rem',
  },
  name: {
    fontFamily: 'var(--ff-display, "Cinzel", Georgia, serif)',
    fontSize: 20,
    fontWeight: 700,
    color: 'var(--gold, #caa550)',
    lineHeight: 1.2,
    marginBottom: 2,
    wordBreak: 'break-word',
  },
  meta: {
    fontSize: 12,
    color: 'var(--text2, #c4b393)',
    lineHeight: 1.4,
    marginBottom: 10,
  },
  sectionHdr: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 0',
    cursor: 'pointer',
    userSelect: 'none',
    borderBottom: '1px solid var(--bdr, rgba(199, 167, 99, .2))',
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: 'var(--ff-display, "Cinzel", Georgia, serif)',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '.1em',
    textTransform: 'uppercase',
    color: 'var(--gold2, #edd48a)',
    flex: 1,
  },
  sectionBody: {
    padding: '6px 0',
  },
  scoreGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 4,
  },
  scoreCard: {
    background: 'var(--bg3, #23201a)',
    border: '1px solid var(--bdr, rgba(199, 167, 99, .2))',
    borderRadius: 4,
    padding: '4px 2px',
    textAlign: 'center',
  },
  scoreLabel: {
    fontFamily: 'var(--ff-display, "Cinzel", Georgia, serif)',
    fontSize: 9,
    letterSpacing: '.08em',
    color: 'var(--text3, #8f7a57)',
    textTransform: 'uppercase',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 1.2,
    color: 'var(--text, #efe6d4)',
  },
  scoreMod: {
    fontSize: 12,
    color: 'var(--text2, #c4b393)',
    lineHeight: 1,
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '3px 0',
    borderBottom: '1px solid var(--bdr, rgba(199, 167, 99, .2))',
    fontSize: 13,
  },
  statLabel: {
    color: 'var(--text2, #c4b393)',
  },
  statValue: {
    fontWeight: 700,
    color: 'var(--text, #efe6d4)',
  },
  spellGroup: {
    marginBottom: 4,
  },
  spellGroupLabel: {
    fontFamily: 'var(--ff-display, "Cinzel", Georgia, serif)',
    fontSize: 11,
    color: 'var(--text3, #8f7a57)',
    letterSpacing: '.05em',
    textTransform: 'uppercase',
    marginBottom: 2,
    paddingLeft: 2,
  },
  spellItem: {
    fontSize: 12,
    padding: '1px 4px',
    color: 'var(--text, #efe6d4)',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  schoolTag: {
    fontSize: 9,
    color: 'var(--text3, #8f7a57)',
    fontStyle: 'italic',
  },
  invItem: {
    fontSize: 12,
    color: 'var(--text, #efe6d4)',
    padding: '1px 0',
  },
  arrow: {
    color: 'var(--text3, #8f7a57)',
    fontSize: 10,
    transition: 'transform .2s',
    display: 'inline-flex',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    background: 'var(--bdr, rgba(199, 167, 99, .2))',
    margin: '6px 0',
  },
};

function Icon({ name, size = 14 }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const host = ref.current;
    if (!host) return;
    const el = document.createElement('i');
    el.setAttribute('data-lucide', name);
    el.setAttribute('aria-hidden', 'true');
    host.replaceChildren(el);
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ attrs: { 'stroke-width': 2 } });
    }
  }, [name]);
  return <span ref={ref} style={{ display: 'inline-flex', width: size, height: size, alignItems: 'center', justifyContent: 'center' }} aria-hidden="true" />;
}

function getMod(val) {
  return Math.floor(((Number(val) || 10) - 10) / 2);
}

function modStr(val) {
  const m = Math.floor(((Number(val) || 10) - 10) / 2);
  if (m === 0) return '±0';
  return m > 0 ? `+${m}` : `${m}`;
}

function getBaseScores(char) {
  const method = char.scoreMethod || 'pointbuy';
  if (method === 'pointbuy') return char.pbScores || {};
  if (method === 'array') return char.arrAssign || {};
  if (method === 'manual') return char.manualScores || {};
  if (method === 'dice') return char.diceAssign || {};
  return {};
}

function getSpeciesBonuses(speciesObj) {
  const out = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  if (!speciesObj) return out;
  const abil = speciesObj.ability || [];
  for (const entry of abil) {
    if (entry.str != null) out.str += Number(entry.str);
    if (entry.dex != null) out.dex += Number(entry.dex);
    if (entry.con != null) out.con += Number(entry.con);
    if (entry.int != null) out.int += Number(entry.int);
    if (entry.wis != null) out.wis += Number(entry.wis);
    if (entry.cha != null) out.cha += Number(entry.cha);
  }
  return out;
}

function getBgBonuses(bgObj, bgAbility) {
  const out = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  if (!bgObj) return out;
  const arr = Array.isArray(bgAbility) && bgAbility.length === 2 ? bgAbility : [];
  if (arr.length === 2) {
    if (arr[0]) out[arr[0]] = (out[arr[0]] || 0) + 1;
    if (arr[1]) out[arr[1]] = (out[arr[1]] || 0) + 1;
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

function computeHp(char, conMod) {
  const cls = char.cls;
  if (!cls || !cls.hd) return { max: 0, current: 0 };
  const hdNum = parseInt(cls.hd.replace('d', ''), 10) || 8;
  const lvl = Math.max(1, Number(char.level) || 1);
  const hpMode = char.hpMode || 'average';
  let total = hdNum + conMod;
  if (lvl > 1) {
    if (hpMode === 'average') {
      total += (lvl - 1) * (Math.floor(hdNum / 2) + 1 + conMod);
    } else {
      const rolls = char.hpManualRolls || {};
      for (let i = 2; i <= lvl; i++) {
        total += Math.max(1, (Number(rolls[i]) || 0) + conMod);
      }
    }
  }
  return { max: total, current: total };
}

function CollapsibleSection({ icon, title, defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen !== false);
  return (
    <div>
      <div
        style={S.sectionHdr}
        role="button"
        tabIndex={0}
        onClick={() => setOpen(v => !v)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(v => !v); } }}
      >
        <span style={{ ...S.arrow, transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          <Icon name="chevron-right" size={12} />
        </span>
        {icon && <Icon name={icon} size={13} />}
        <span style={S.sectionTitle}>{title}</span>
      </div>
      {open && <div style={S.sectionBody}>{children}</div>}
    </div>
  );
}

export default function PreviewSidebar({ char, spellDb }) {
  const [scores, setScores] = useState(() => computeFinalScores(char));
  const [hp, setHp] = useState(() => computeHp(char, getMod(scores.con)));

  useEffect(() => {
    const next = computeFinalScores(char);
    setScores(next);
    setHp(computeHp(char, getMod(next.con)));
  }, [
    char.scoreMethod, char.level, char.hpMode, char.hpManualRolls,
    char.pbScores, char.arrAssign, char.manualScores, char.diceAssign,
    char.speciesObj, char.bgObj, char.bgAbility,
    char.cls,
  ]);

  const conMod = getMod(scores.con);
  const pb = Math.floor((Number(char.level) + 7) / 4);
  const speed = char.speciesObj?.speed || 30;

  const spellsByLevel = {};
  const cantripList = Array.isArray(char.selectedCantrips) ? char.selectedCantrips : [];
  const selectedSpells = char.selectedSpells || {};

  if (Array.isArray(spellDb)) {
    for (const s of cantripList) {
      const found = spellDb.find(sp => sp.name === s);
      if (found) {
        if (!spellsByLevel[0]) spellsByLevel[0] = [];
        spellsByLevel[0].push(found);
      }
    }
    for (const [lvl, names] of Object.entries(selectedSpells)) {
      const arr = Array.isArray(names) ? names : [];
      const levelNum = Number(lvl);
      for (const name of arr) {
        const found = spellDb.find(sp => sp.name === name);
        if (found) {
          if (!spellsByLevel[levelNum]) spellsByLevel[levelNum] = [];
          spellsByLevel[levelNum].push(found);
        }
      }
    }
  }

  const allSpellKeys = [...cantripList];
  for (const arr of Object.values(selectedSpells)) {
    if (Array.isArray(arr)) allSpellKeys.push(...arr);
  }

  const totalSpells = allSpellKeys.length;

  const invCount = Array.isArray(char.inventory) ? char.inventory.length : 0;
  const currency = char.currency || {};

  function coinDisplay() {
    const parts = [];
    if (currency.gp) parts.push(`${currency.gp} gp`);
    if (currency.sp) parts.push(`${currency.sp} sp`);
    if (currency.cp) parts.push(`${currency.cp} cp`);
    if (currency.pp) parts.push(`${currency.pp} pp`);
    if (currency.ep) parts.push(`${currency.ep} ep`);
    return parts.length ? parts.join(' · ') : '—';
  }

  const metaParts = [];
  if (char.className) metaParts.push(`${char.className} ${char.level}`);
  if (char.speciesName) metaParts.push(char.speciesName);
  if (char.bgName) metaParts.push(char.bgName);

  return (
    <div style={S.sidebar}>
      <div className="ph"><span className="pt">Preview</span></div>
      <div style={S.scroll}>
        <div style={S.name}>{char.name || 'Unnamed Hero'}</div>
        <div style={S.meta}>{metaParts.join(' · ') || '\u00A0'}</div>

        <CollapsibleSection icon="shield" title="Ability Scores">
          <div style={S.scoreGrid}>
            {STATS.map(stat => (
              <div key={stat} style={S.scoreCard}>
                <div style={S.scoreLabel}>{STAT_LABELS[stat]}</div>
                <div style={S.scoreValue}>{scores[stat]}</div>
                <div style={S.scoreMod}>{modStr(scores[stat])}</div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection icon="heart" title="Key Stats" defaultOpen={true}>
          <div style={S.statRow}>
            <span style={S.statLabel}>HP</span>
            <span style={S.statValue}>{hp.max}</span>
          </div>
          <div style={S.statRow}>
            <span style={S.statLabel}>AC</span>
            <span style={S.statValue}>{10 + Number(getMod(scores.dex))}</span>
          </div>
          <div style={S.statRow}>
            <span style={S.statLabel}>Prof. Bonus</span>
            <span style={S.statValue}>+{pb}</span>
          </div>
          <div style={S.statRow}>
            <span style={S.statLabel}>Speed</span>
            <span style={S.statValue}>{speed} ft.</span>
          </div>
          <div style={S.statRow}>
            <span style={S.statLabel}>Initiative</span>
            <span style={S.statValue}>{modStr(scores.dex)}</span>
          </div>
        </CollapsibleSection>

        {totalSpells > 0 && (
          <CollapsibleSection icon="sparkles" title={`Spells (${totalSpells})`}>
            {Object.entries(spellsByLevel).map(([level, spells]) => (
              <div key={level} style={S.spellGroup}>
                <div style={S.spellGroupLabel}>
                  {Number(level) === 0 ? 'Cantrips' : `Level ${level}`}
                </div>
                {spells.map(sp => (
                  <div key={sp.name} style={S.spellItem}>
                    <Icon name="circle" size={6} />
                    <span>{sp.name}</span>
                    {sp.school && <span style={S.schoolTag}>({sp.school})</span>}
                  </div>
                ))}
              </div>
            ))}
          </CollapsibleSection>
        )}

        <CollapsibleSection icon="backpack" title={`Equipment (${invCount})`}>
          {invCount > 0 ? (
            <>
              {char.inventory.slice(0, 20).map((item, i) => (
                <div key={i} style={S.invItem}>
                  · {typeof item === 'string' ? item : (item.name || item.item || 'Unknown')}
                  {item.qty && item.qty > 1 ? ` (${item.qty})` : ''}
                </div>
              ))}
              {invCount > 20 && (
                <div style={{ ...S.invItem, color: 'var(--text3)' }}>
                  … and {invCount - 20} more
                </div>
              )}
              <div style={S.divider} />
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                Coin: {coinDisplay()}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>Empty</div>
          )}
        </CollapsibleSection>
      </div>
    </div>
  );
}
