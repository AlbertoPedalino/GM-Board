import { useState, useEffect, useMemo } from 'react';
import { useCharbuilderContext } from './CharbuilderContext.jsx';
import InfoCard from './InfoCard.jsx';

const STATS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const STAT_LABELS = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };
const STAT_COLORS = { str: '#e06c75', dex: '#61afef', con: '#98c379', int: '#c678dd', wis: '#d19a66', cha: '#56b6c2' };

const S = {
  panel: {
    background: '#1a1713',
    border: '1px solid rgba(199, 167, 99, .2)',
    borderRadius: 9,
    padding: 16,
    marginBottom: 12,
  },
  panelTitle: {
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: 14,
    fontWeight: 700,
    color: '#edd48a',
    letterSpacing: '.06em',
    marginBottom: 10,
  },
  searchInput: {
    width: '100%',
    padding: '8px 10px',
    background: '#23201a',
    border: '1px solid rgba(199, 167, 99, .2)',
    borderRadius: 6,
    color: '#efe6d4',
    fontSize: 13,
    fontFamily: "'EB Garamond', Georgia, serif",
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 8,
  },
  bgRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 10px',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'background .15s',
    borderBottom: '1px solid rgba(199, 167, 99, .08)',
  },
  bgRowHover: {
    background: 'rgba(199, 167, 99, .08)',
  },
  bgName: {
    color: '#c4b393',
    fontSize: 14,
    fontFamily: "'EB Garamond', Georgia, serif",
    fontWeight: 600,
    lineHeight: 1.3,
  },
  bgNameSelected: {
    color: '#edd48a',
  },
  bgSource: {
    color: '#8f7a57',
    fontSize: 11,
    fontStyle: 'italic',
    whiteSpace: 'nowrap',
    marginLeft: 8,
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#caa550',
    flexShrink: 0,
    marginRight: 10,
  },
  emptyText: {
    color: '#8f7a57',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '16px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 6,
  },
  statBtn: {
    padding: '8px 4px',
    borderRadius: 6,
    border: '1px solid rgba(199, 167, 99, .2)',
    background: '#23201a',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background .15s, border-color .15s, color .15s',
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '.05em',
    lineHeight: 1.2,
  },
  statBtnActive: {
    background: 'rgba(202, 165, 80, .15)',
    borderColor: '#caa550',
    color: '#edd48a',
  },
  statBtnInactive: {
    color: '#8f7a57',
  },
  choiceBlock: {
    marginBottom: 12,
  },
  choiceQuestion: {
    color: '#c4b393',
    fontSize: 13,
    fontFamily: "'EB Garamond', Georgia, serif",
    fontWeight: 600,
    marginBottom: 6,
  },
  choiceOptions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
  },
  choiceChip: {
    padding: '3px 10px',
    borderRadius: 12,
    border: '1px solid rgba(199, 167, 99, .2)',
    background: '#23201a',
    color: '#c4b393',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'background .15s, border-color .15s, color .15s',
    fontFamily: "'EB Garamond', Georgia, serif",
    lineHeight: 1.4,
  },
  choiceChipActive: {
    background: 'rgba(202, 165, 80, .15)',
    borderColor: '#caa550',
    color: '#edd48a',
  },
  loadingOverlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 0',
    color: '#8f7a57',
    fontSize: 13,
    fontFamily: "'EB Garamond', Georgia, serif",
    fontStyle: 'italic',
  },
  scrollList: {
    maxHeight: 260,
    overflowY: 'auto',
  },
  desc: {
    color: '#8f7a57',
    fontSize: 12,
    fontFamily: "'EB Garamond', Georgia, serif",
    fontStyle: 'italic',
    marginBottom: 10,
    lineHeight: 1.4,
  },
};

function parseProficiencyChoices(bgObj) {
  if (!bgObj) return [];
  const out = [];

  const skill = bgObj.skillProficiencies || bgObj._skillProficiencies;
  const tool = bgObj.toolProficiencies || bgObj._toolProficiencies;
  const lang = bgObj.languageProficiencies || bgObj._languageProficiencies;
  const generic = bgObj._choices || bgObj.choices;

  function addSet(arr, label, keyPrefix) {
    if (!Array.isArray(arr)) return;
    for (let i = 0; i < arr.length; i++) {
      const entry = arr[i];
      const pick = entry.choose || entry.pick || entry.any || 1;
      const from = entry.from || entry.options || [];

      if (Array.isArray(from) && from.length > 0) {
        const labelText = `${pick > 0 ? `Choose ${pick}` : 'Choose'} ${label.toLowerCase()}${arr.length > 1 ? ` (${i + 1})` : ''}`;
        out.push({
          key: `${keyPrefix}_${i}`,
          label: labelText,
          pick,
          options: from,
        });
      }

      if (entry.anySkill || entry.anyTool || entry.anyLanguage || entry.anyStandard) {
        continue;
      }
    }
  }

  addSet(skill, 'Skill', 'bg_skill');
  addSet(tool, 'Tool', 'bg_tool');
  addSet(lang, 'Language', 'bg_lang');

  if (Array.isArray(generic) && out.length === 0) {
    for (let i = 0; i < generic.length; i++) {
      const g = generic[i];
      const from = g.from || g.options || [];
      if (Array.isArray(from) && from.length > 0) {
        out.push({
          key: g.key || `bg_choice_${i}`,
          label: g.label || g.name || `Choose ${g.choose || 1}`,
          pick: g.choose || g.pick || 1,
          options: from,
        });
      }
    }
  }

  return out;
}

export default function BackgroundTab() {
  const ctx = useCharbuilderContext();
  const [search, setSearch] = useState('');
  const [hoveredIdx, setHoveredIdx] = useState(-1);

  const state = {
    bgName: ctx.char.bgName,
    bgSource: ctx.char.bgSource,
    bgObj: ctx.char.bgObj,
    allBgs: ctx.allBgs,
    choices: ctx.char.choices,
    bgAbility: ctx.char.bgAbility,
    bgPatternIdx: ctx.char.bgPatternIdx,
    loading: ctx.loading,
  };

  const actions = {
    selectBg: ctx.selectBg,
    toggleChoice: ctx.toggleChoice,
    loadBgData: ctx.loadBackgroundsData,
    setBgAbility: ctx.setBgAbility,
    setBgPatternIdx: ctx.setBgPatternIdx,
  };

  useEffect(() => {
    if (!state.allBgs || state.allBgs.length === 0) {
      actions.loadBgData();
    }
  }, []);

  const isBgLoaded = state.allBgs && state.allBgs.length > 0;
  const isLoading = state.loading && state.loading.backgrounds;

  const filteredBgs = useMemo(() => {
    if (!state.allBgs) return [];
    const q = search.toLowerCase().trim();
    if (!q) return state.allBgs;
    return state.allBgs.filter(b =>
      b.name.toLowerCase().includes(q) ||
      (b.source || '').toLowerCase().includes(q)
    );
  }, [state.allBgs, search]);

  const selectedName = state.bgName;
  const selectedSource = state.bgSource;
  const selectedBg = state.bgObj;

  function handleSelect(name, source) {
    actions.selectBg(name, source);
  }

  function handleToggleAbility(stat) {
    const cur = Array.isArray(state.bgAbility) ? state.bgAbility : [];
    if (cur.includes(stat)) {
      actions.setBgAbility(cur.filter(s => s !== stat));
    } else if (cur.length < 2) {
      actions.setBgAbility([...cur, stat]);
    }
  }

  const choiceData = useMemo(() => parseProficiencyChoices(selectedBg), [selectedBg]);

  function isChoiceSelected(key, value) {
    const sel = state.choices[key];
    if (Array.isArray(sel)) return sel.includes(value);
    return sel === value;
  }

  function handleToggleChoice(key, value) {
    actions.toggleChoice(key, value);
  }

  return (
    <div>
      <div style={S.panel}>
        <div style={S.panelTitle}>Background</div>
        <input
          type="text"
          placeholder="Search backgrounds…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={S.searchInput}
        />

        {isLoading && !isBgLoaded && (
          <div style={S.loadingOverlay}>Loading backgrounds…</div>
        )}

        {!isLoading && isBgLoaded && filteredBgs.length === 0 && (
          <div style={S.emptyText}>
            {search ? 'No backgrounds match your search.' : 'No backgrounds available.'}
          </div>
        )}

        {isBgLoaded && filteredBgs.length > 0 && (
          <div style={S.scrollList}>
            {filteredBgs.map((bg, i) => {
              const isSelected = bg.name === selectedName && bg.source === selectedSource;
              return (
                <div
                  key={`${bg.name}_${bg.source || ''}_${i}`}
                  style={{
                    ...S.bgRow,
                    background: isSelected
                      ? 'rgba(202, 165, 80, .1)'
                      : hoveredIdx === i
                        ? 'rgba(199, 167, 99, .08)'
                        : 'transparent',
                  }}
                  onClick={() => handleSelect(bg.name, bg.source)}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(-1)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                    {isSelected && <div style={S.selectedDot} />}
                    <span
                      style={{
                        ...S.bgName,
                        ...(isSelected ? S.bgNameSelected : {}),
                        marginLeft: isSelected ? 0 : 18,
                      }}
                    >
                      {bg.name}
                    </span>
                  </div>
                  {bg.source && (
                    <span style={S.bgSource}>{bg.source}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {selectedBg && (
          <div style={{ marginTop: 12 }}>
            <InfoCard item={selectedBg} />
          </div>
        )}
      </div>

      {selectedBg && (
        <div style={S.panel}>
          <div style={S.panelTitle}>Ability Score Bonuses</div>
          <div style={S.desc}>
            Choose two different ability scores. Each gets a +1 bonus.
          </div>
          <div style={S.grid}>
            {STATS.map(stat => {
              const active = (state.bgAbility || []).includes(stat);
              const full = (state.bgAbility || []).length >= 2 && !active;
              return (
                <div
                  key={stat}
                  style={{
                    ...S.statBtn,
                    ...(active ? S.statBtnActive : S.statBtnInactive),
                    opacity: full ? 0.4 : 1,
                    cursor: full ? 'not-allowed' : 'pointer',
                    color: active ? '#edd48a' : STAT_COLORS[stat],
                  }}
                  onClick={() => !full && handleToggleAbility(stat)}
                >
                  {STAT_LABELS[stat]}
                  {active && <span style={{ display: 'block', fontSize: 10, fontWeight: 400, color: '#caa550' }}>+1</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedBg && choiceData.length > 0 && (
        <div style={S.panel}>
          <div style={S.panelTitle}>Proficiency Choices</div>
          {choiceData.map((choice) => {
            const key = choice.key;
            const picked = Array.isArray(state.choices[key])
              ? state.choices[key].length
              : state.choices[key]
                ? 1
                : 0;
            const remaining = Math.max(0, choice.pick - picked);
            return (
              <div key={key} style={S.choiceBlock}>
                <div style={S.choiceQuestion}>
                  {choice.label}
                  {remaining > 0 && (
                    <span style={{ color: '#8f7a57', fontWeight: 400, marginLeft: 6 }}>
                      ({remaining} left)
                    </span>
                  )}
                  {remaining === 0 && picked >= choice.pick && (
                    <span style={{ color: '#98c379', fontWeight: 400, marginLeft: 6 }}>
                      (done)
                    </span>
                  )}
                </div>
                <div style={S.choiceOptions}>
                  {choice.options.map((opt) => {
                    const optStr = typeof opt === 'string' ? opt : (opt.name || opt.id || String(opt));
                    const selected = isChoiceSelected(key, optStr);
                    const canSelect = selected || remaining > 0;
                    return (
                      <span
                        key={optStr}
                        style={{
                          ...S.choiceChip,
                          ...(selected ? S.choiceChipActive : {}),
                          opacity: canSelect ? 1 : 0.35,
                          cursor: canSelect ? 'pointer' : 'not-allowed',
                        }}
                        onClick={() => canSelect && handleToggleChoice(key, optStr)}
                      >
                        {optStr}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
