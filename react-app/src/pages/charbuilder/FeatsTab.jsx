import { useEffect, useMemo, useState } from 'react';
import { useCharbuilderContext } from './CharbuilderContext.jsx';
import InfoCard from './InfoCard';

const ASI_LEVELS = [4, 8, 12, 16, 19];
const STATS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const STAT_LABELS = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };

function getFeatSlots(level) {
  return ASI_LEVELS.filter(l => Number(level) >= l).length;
}

function featKey(name) {
  return 'feat_' + name;
}

function checkPrereq(feat, char) {
  if (!feat.prerequisite) return { ok: true, reason: null };
  const list = Array.isArray(feat.prerequisite) ? feat.prerequisite : [feat.prerequisite];
  for (const p of list) {
    if (typeof p === 'string') {
      const lower = p.toLowerCase();
      const lvlMatch = lower.match(/(?:level\s+)?(\d+)(?:\s*\+)?(?:\s*level)?/);
      if (lvlMatch && Number(lvlMatch[1]) > (char.level || 1)) {
        return { ok: false, reason: p };
      }
      const clsMatch = lower.match(/^(\w+)\s+class$/);
      if (clsMatch && clsMatch[1].toLowerCase() !== (char.className || '').toLowerCase()) {
        return { ok: false, reason: p };
      }
      for (const s of STATS) {
        const re = new RegExp(s + '\\s+(\\d+)', 'i');
        const m = p.match(re);
        if (m && (char.pbScores?.[s] || 0) < Number(m[1])) {
          return { ok: false, reason: p };
        }
      }
      if (lower.includes('spellcasting') || lower.includes('spell')) {
        const hasSpells = (char.selectedCantrips?.length > 0) ||
          Object.values(char.selectedSpells || {}).some(a => a?.length > 0);
        if (!hasSpells) return { ok: false, reason: p };
      }
    }
    if (p && typeof p === 'object') {
      if (p.level && Number(p.level) > (char.level || 1)) {
        return { ok: false, reason: 'Level ' + p.level + '+' };
      }
      if (p.ability) {
        for (const a of p.ability) {
          const [stat, val] = [Object.keys(a)[0], Object.values(a)[0]];
          if (stat && val && (char.pbScores?.[stat] || 10) < Number(val)) {
            return { ok: false, reason: stat.toUpperCase() + ' ' + val };
          }
        }
      }
      if (p.spellcasting && !char.cls) {
        return { ok: false, reason: 'Spellcasting' };
      }
    }
  }
  return { ok: true, reason: null };
}

function getCategoryColor(cat) {
  if (!cat) return { label: 'Feat', color: '#8f7a57' };
  const l = cat.toLowerCase();
  if (l === 'origin') return { label: 'Origin', color: '#5a9e6f' };
  if (l === 'general') return { label: 'General', color: '#caa550' };
  return { label: cat, color: '#8f7a57' };
}

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
  },
  loadingWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    color: '#c4b393',
    fontSize: 14,
    gap: 8,
  },
  spinner: {
    width: 14,
    height: 14,
    border: '2px solid rgba(199,167,99,.2)',
    borderTopColor: '#caa550',
    borderRadius: '50%',
    animation: 'sheet-loading-spin .9s linear infinite',
  },
  card: {
    background: '#23201a',
    border: '1px solid rgba(199,167,99,.2)',
    borderRadius: 9,
    padding: '12px 14px',
  },
  slotsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  slotDot: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    lineHeight: 1,
  },
  searchInput: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: 6,
    border: '1px solid rgba(199,167,99,.2)',
    background: '#1a1713',
    color: '#efe6d4',
    fontSize: 13,
    outline: 'none',
  },
  catHdr: {
    fontFamily: 'Cinzel, Georgia, serif',
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '.08em',
    color: '#edd48a',
    margin: '12px 0 6px',
    paddingBottom: 4,
    borderBottom: '1px solid rgba(199,167,99,.2)',
  },
  featRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 8px',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'background .1s',
    border: '1px solid transparent',
  },
  featRowSel: {
    borderColor: 'rgba(202,165,80,.4)',
    background: 'rgba(202,165,80,.08)',
  },
  featName: {
    flex: 1,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.3,
  },
  featPrereq: {
    fontSize: 11,
    color: '#8f7a57',
    fontStyle: 'italic',
  },
  badge: {
    fontSize: 9,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '.05em',
    padding: '1px 5px',
    border: '1px solid',
    borderRadius: 3,
    whiteSpace: 'nowrap',
  },
  selectedSection: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  selTag: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 8px',
    borderRadius: 6,
    background: 'rgba(202,165,80,.12)',
    border: '1px solid rgba(202,165,80,.3)',
    fontSize: 13,
    lineHeight: 1,
  },
  remBtn: {
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    color: '#8f7a57',
    fontSize: 14,
    lineHeight: 1,
    padding: 0,
    display: 'flex',
  },
  asiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: 4,
    marginTop: 6,
  },
  asiStatBtn: {
    padding: '4px 0',
    borderRadius: 4,
    border: '1px solid rgba(199,167,99,.2)',
    background: '#1a1713',
    color: '#c4b393',
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'center',
    fontFamily: 'Cinzel, Georgia, serif',
  },
  asiStatAct: {
    background: 'rgba(202,165,80,.15)',
    borderColor: '#caa550',
    color: '#edd48a',
  },
  btn: {
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    background: '#caa550',
    color: '#1a1713',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'Cinzel, Georgia, serif',
  },
  btnOutline: {
    padding: '6px 12px',
    borderRadius: 6,
    border: '1px solid rgba(199,167,99,.3)',
    background: 'transparent',
    color: '#c4b393',
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: 'Cinzel, Georgia, serif',
  },
};

export default function FeatsTab() {
  const { state, actions } = useCharbuilderContext();
  const char = state.char;
  const { allFeats, loading } = state;
  const choices = char.choices || {};

  const [search, setSearch] = useState('');
  const [selectedFeat, setSelectedFeat] = useState(null);

  useEffect(() => {
    if (!allFeats || allFeats.length === 0) {
      actions.loadFeatsData();
    }
  }, []);

  const totalSlots = useMemo(() => getFeatSlots(char.level), [char.level]);

  const featNames = useMemo(() => {
    const names = [];
    for (const key of Object.keys(choices)) {
      if (key.startsWith('feat_') && choices[key] === true) {
        names.push(key.slice(5));
      }
    }
    return names;
  }, [choices]);

  const asiSlots = useMemo(() => {
    const used = featNames.length;
    const filled = [];
    for (let i = 0; i < Math.min(totalSlots, used); i++) {
      filled.push({ type: 'feat', name: featNames[i], idx: i });
    }
    for (let i = used; i < totalSlots; i++) {
      const mode = choices['asi_mode_' + i] || null;
      const stat1 = choices['asi_stat1_' + i] || null;
      const stat2 = choices['asi_stat2_' + i] || null;
      filled.push({ type: 'asi', idx: i, mode, stat1, stat2 });
    }
    return filled;
  }, [totalSlots, featNames, choices]);

  const { originFeats, generalFeats } = useMemo(() => {
    const arr = Array.isArray(allFeats) ? allFeats : [];
    const o = [];
    const g = [];
    for (const f of arr) {
      if (!f || !f.name) continue;
      const cat = (f.category || f.featType || '').toLowerCase();
      if (cat === 'origin') o.push(f);
      else g.push(f);
    }
    return { originFeats: o, generalFeats: g };
  }, [allFeats]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return null;
    const arr = Array.isArray(allFeats) ? allFeats : [];
    return arr.filter(f => f && f.name && f.name.toLowerCase().includes(q));
  }, [search, allFeats]);

  function toggleFeat(name) {
    actions.toggleChoice(featKey(name), true);
  }

  function isSelected(name) {
    return !!choices[featKey(name)];
  }

  function renderSlotSummary() {
    return (
      <div style={S.card}>
        <div style={{ fontSize: 12, color: '#c4b393', marginBottom: 8, fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Feat Slots ({asiSlots.length}/{totalSlots})
        </div>
        <div style={S.slotsRow}>
          {Array.from({ length: totalSlots }).map((_, i) => {
            const slot = asiSlots[i];
            let fill = slot?.type === 'feat' ? '#3fa66c' : slot?.mode ? '#caa550' : '#1a1713';
            let bdr = slot?.type === 'feat' ? '#3fa66c' : slot?.mode ? '#caa550' : 'rgba(199,167,99,.2)';
            return (
              <div key={i} style={{ ...S.slotDot, background: fill, border: '1px solid ' + bdr, color: slot?.mode || slot?.type === 'feat' ? '#1a1713' : '#8f7a57' }}>
                {ASI_LEVELS[i] || (i + 1) * 4}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 12, color: '#8f7a57', marginTop: 6 }}>
          {featNames.length} feat{featNames.length !== 1 ? 's' : ''} selected &middot; {totalSlots - featNames.length} ASI slot{totalSlots - featNames.length !== 1 ? 's' : ''} available
        </div>
      </div>
    );
  }

  function renderSelected() {
    if (featNames.length === 0) return null;
    return (
      <div style={S.card}>
        <div style={{ fontSize: 12, color: '#edd48a', marginBottom: 8, fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Selected Feats
        </div>
        <div style={S.selectedSection}>
          {featNames.map(name => (
            <div key={name} style={S.selTag}>
              <span>{name}</span>
              <button
                style={S.remBtn}
                onClick={() => actions.toggleChoice(featKey(name), true)}
                aria-label={'Remove ' + name}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderAsiSlots() {
    const unassigned = asiSlots.filter(s => s.type === 'asi');
    if (unassigned.length === 0) return null;
    return (
      <div style={S.card}>
        <div style={{ fontSize: 12, color: '#edd48a', marginBottom: 8, fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Ability Score Improvements
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {unassigned.map(slot => (
            <AsiSlot key={slot.idx} slot={slot} choices={choices} actions={actions} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#8f7a57', marginTop: 6, fontStyle: 'italic' }}>
          Or select a feat from below to fill this slot
        </div>
      </div>
    );
  }

  function renderPrereqBadge(feat) {
    const result = checkPrereq(feat, char);
    if (result.ok && !feat.prerequisite) return null;
    if (result.ok) {
      return <span style={{ ...S.badge, color: '#5a9e6f', borderColor: '#5a9e6f' }}>Met</span>;
    }
    return (
      <span style={{ ...S.badge, color: '#c0392b', borderColor: '#c0392b', fontSize: 8 }}>
        {result.reason}
      </span>
    );
  }

  function renderFeatList(feats, title) {
    if (!feats || feats.length === 0) return null;
    return (
      <div>
        <div style={S.catHdr}>{title} ({feats.length})</div>
        {feats.map(feat => {
          const sel = isSelected(feat.name);
          const prereq = checkPrereq(feat, char);
          const catColor = getCategoryColor(feat.category || feat.featType);
          return (
            <div
              key={feat.source + '_' + feat.name}
              style={{ ...S.featRow, ...(sel ? S.featRowSel : {}), opacity: prereq.ok || sel ? 1 : 0.45 }}
              onClick={() => {
                if (prereq.ok || sel) toggleFeat(feat.name);
              }}
              onMouseEnter={() => setSelectedFeat(feat)}
              onMouseLeave={() => setSelectedFeat(prev => prev?.name === feat.name ? null : prev)}
            >
              <span style={{ color: sel ? '#edd48a' : '#8f7a57', fontSize: 13, width: 16, textAlign: 'center' }}>
                {sel ? '\u2714' : '\u25CB'}
              </span>
              <span style={{ ...S.featName, color: sel ? '#edd48a' : '#efe6d4' }}>{feat.name}</span>
              <span style={{ color: '#8f7a57', fontSize: 11, fontStyle: 'italic' }}>{feat.source}</span>
              <span style={{ ...S.badge, color: catColor.color, borderColor: catColor.color }}>{catColor.label}</span>
              {feat.prerequisite && renderPrereqBadge(feat)}
            </div>
          );
        })}
      </div>
    );
  }

  const displayFeats = filtered || { origin: originFeats, general: generalFeats };
  const showFiltered = filtered !== null;
  const filteredOrigin = showFiltered ? filtered.filter(f => (f.category || f.featType || '').toLowerCase() === 'origin') : [];
  const filteredGeneral = showFiltered ? filtered.filter(f => (f.category || f.featType || '').toLowerCase() !== 'origin') : [];

  if (loading.feats && (!allFeats || allFeats.length === 0)) {
    return (
      <div style={S.wrap}>
        <div style={S.loadingWrap}>
          <div style={S.spinner} />
          <span>Loading feats&hellip;</span>
        </div>
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <h2 style={S.hdr}>Feats &amp; ASI</h2>
      <p style={S.sub}>
        Choose feats or ability score improvements for your character. At levels 4, 8, 12, 16, and 19,
        you gain a feat or an ASI.
      </p>

      {renderSlotSummary()}
      {renderSelected()}
      {renderAsiSlots()}

      <div>
        <input
          style={S.searchInput}
          placeholder="Search feats&hellip;"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {showFiltered ? (
        filtered.length === 0 ? (
          <div style={{ color: '#8f7a57', fontStyle: 'italic', fontSize: 13 }}>No feats match your search.</div>
        ) : (
          <>
            {filteredOrigin.length > 0 && renderFeatList(filteredOrigin, 'Origin Feats')}
            {filteredGeneral.length > 0 && renderFeatList(filteredGeneral, 'General Feats')}
          </>
        )
      ) : (
        <>
          {originFeats.length > 0 && renderFeatList(originFeats, 'Origin Feats')}
          {generalFeats.length > 0 && renderFeatList(generalFeats, 'General Feats')}
        </>
      )}

      {selectedFeat && (
        <InfoCard item={selectedFeat} tags={[getCategoryColor(selectedFeat.category || selectedFeat.featType)]}>
          {selectedFeat.prerequisite && (
            <div style={{ fontSize: 12, color: '#8f7a57', marginTop: 8, fontStyle: 'italic' }}>
              Prerequisite: {Array.isArray(selectedFeat.prerequisite) ? selectedFeat.prerequisite.join(', ') : String(selectedFeat.prerequisite)}
            </div>
          )}
          <div style={{ marginTop: 8 }}>
            <button
              style={isSelected(selectedFeat.name) ? { ...S.btn, background: '#8f7a57' } : S.btn}
              onClick={() => toggleFeat(selectedFeat.name)}
            >
              {isSelected(selectedFeat.name) ? 'Remove Feat' : 'Select Feat'}
            </button>
          </div>
        </InfoCard>
      )}
    </div>
  );
}

function AsiSlot({ slot, choices, actions }) {
  const modeKey = 'asi_mode_' + slot.idx;
  const stat1Key = 'asi_stat1_' + slot.idx;
  const stat2Key = 'asi_stat2_' + slot.idx;
  const mode = choices[modeKey] || null;
  const stat1 = choices[stat1Key] || null;
  const stat2 = choices[stat2Key] || null;

  return (
    <div>
      <div style={{ fontSize: 12, color: '#c4b393', marginBottom: 4 }}>
        Slot {slot.idx + 1} (Level {ASI_LEVELS[slot.idx] || (slot.idx + 1) * 4})
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
        <button
          style={{
            ...S.btnOutline,
            ...(mode === '+2' ? { background: 'rgba(202,165,80,.15)', borderColor: '#caa550', color: '#edd48a' } : {}),
          }}
          onClick={() => actions.selectChoice(modeKey, mode === '+2' ? null : '+2')}
        >
          +2 One Stat
        </button>
        <button
          style={{
            ...S.btnOutline,
            ...(mode === '+1+1' ? { background: 'rgba(202,165,80,.15)', borderColor: '#caa550', color: '#edd48a' } : {}),
          }}
          onClick={() => actions.selectChoice(modeKey, mode === '+1+1' ? null : '+1+1')}
        >
          +1 Two Stats
        </button>
      </div>
      {mode === '+2' && (
        <div>
          <div style={{ fontSize: 11, color: '#8f7a57', marginBottom: 4 }}>Choose one stat:</div>
          <div style={S.asiGrid}>
            {STATS.map(s => (
              <button
                key={s}
                style={{ ...S.asiStatBtn, ...(stat1 === s ? S.asiStatAct : {}) }}
                onClick={() => actions.selectChoice(stat1Key, stat1 === s ? null : s)}
              >
                {STAT_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      )}
      {mode === '+1+1' && (
        <div>
          <div style={{ fontSize: 11, color: '#8f7a57', marginBottom: 4 }}>Choose two different stats:</div>
          <div style={S.asiGrid}>
            {STATS.map(s => {
              const active = stat1 === s || stat2 === s;
              return (
                <button
                  key={s}
                  style={{ ...S.asiStatBtn, ...(active ? S.asiStatAct : {}) }}
                  onClick={() => {
                    if (stat1 === s) {
                      actions.selectChoice(stat1Key, null);
                    } else if (stat2 === s) {
                      actions.selectChoice(stat2Key, null);
                    } else if (!stat1) {
                      actions.selectChoice(stat1Key, s);
                    } else if (!stat2 && s !== stat1) {
                      actions.selectChoice(stat2Key, s);
                    }
                  }}
                >
                  {STAT_LABELS[s]}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
