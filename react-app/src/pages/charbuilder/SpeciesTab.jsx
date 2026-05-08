import { useState, useEffect, useMemo, useCallback } from 'react';
import { useCharbuilderContext } from './CharbuilderContext.jsx';
import InfoCard from './InfoCard.jsx';

const AB = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const AB_LABEL = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };

const S = {
  wrap: { display: 'flex', gap: 16, padding: 16, height: '100%', fontFamily: 'var(--ff-body, "EB Garamond", Georgia, serif)', color: 'var(--text, #efe6d4)', fontSize: 14 },
  leftCol: { width: 360, minWidth: 360, display: 'flex', flexDirection: 'column', gap: 12 },
  rightCol: { flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' },
  search: { width: '100%', padding: '8px 12px', background: 'var(--bg3, #23201a)', border: '1px solid var(--bdr, rgba(199, 167, 99, .2))', borderRadius: 'var(--r, 9px)', color: 'var(--text, #efe6d4)', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
  list: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 6, cursor: 'pointer', transition: 'background .1s', border: '1px solid transparent' },
  rowSelected: { background: 'rgba(199, 167, 99, .1)', borderColor: 'var(--bdr, rgba(199, 167, 99, .4))' },
  rowName: { fontWeight: 600, color: 'var(--text, #efe6d4)', fontSize: 14 },
  rowSource: { color: 'var(--text3, #8f7a57)', fontSize: 11, fontStyle: 'italic' },
  section: { background: 'var(--bg3, #23201a)', border: '1px solid var(--bdr, rgba(199, 167, 99, .2))', borderRadius: 'var(--r, 9px)', padding: '14px 16px' },
  sectionTitle: { fontFamily: 'var(--ff-display, Cinzel)', fontSize: 13, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--gold2, #edd48a)', marginBottom: 10 },
  abGrid: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 },
  abBtn: { padding: '8px 4px', textAlign: 'center', background: 'var(--bg2, #1a1713)', border: '1px solid var(--bdr, rgba(199, 167, 99, .2))', borderRadius: 6, cursor: 'pointer', transition: 'all .1s', color: 'var(--text2, #c4b393)', fontSize: 12, fontWeight: 600 },
  abBtnActive: { background: 'rgba(199, 167, 99, .2)', borderColor: 'var(--gold2, #edd48a)', color: 'var(--gold2, #edd48a)' },
  choiceLabel: { fontSize: 12, fontWeight: 600, color: 'var(--text2, #c4b393)', marginBottom: 4 },
  choiceGrid: { display: 'flex', flexWrap: 'wrap', gap: 4 },
  chip: { padding: '4px 10px', borderRadius: 4, fontSize: 12, cursor: 'pointer', border: '1px solid var(--bdr, rgba(199, 167, 99, .2))', background: 'var(--bg2, #1a1713)', color: 'var(--text2, #c4b393)', transition: 'all .1s' },
  chipActive: { background: 'rgba(199, 167, 99, .2)', borderColor: 'var(--gold2, #edd48a)', color: 'var(--gold2, #edd48a)' },
  fixedBonus: { fontSize: 12, color: 'var(--text3, #8f7a57)', marginBottom: 8 },
  empty: { color: 'var(--text3, #8f7a57)', fontStyle: 'italic', fontSize: 13, padding: '20px 0', textAlign: 'center' },
  loading: { color: 'var(--text3, #8f7a57)', fontSize: 13, padding: '20px 0', textAlign: 'center', fontStyle: 'italic' },
};

function normKey(v) { return String(v || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
function abKey(name, source) { const n = normKey(name), s = normKey(source); return n && s ? `${n}_${s}` : ''; }

function getChoiceSpecs(speciesObj) {
  if (!speciesObj || !speciesObj.name) return [];
  const key = abKey(speciesObj.name, speciesObj.source);
  let specs = [];
  if (window.SpeciesAdapters && typeof window.SpeciesAdapters[key] === 'function') {
    try { specs = window.SpeciesAdapters[key](speciesObj); }
    catch (e) { console.warn('SpeciesAdapter error for', key, e); }
  }
  if (!specs || !specs.length) {
    if (typeof window.getGenericSpeciesChoiceSpecs === 'function') {
      try { specs = window.getGenericSpeciesChoiceSpecs(speciesObj); }
      catch (e) { console.warn('getGenericSpeciesChoiceSpecs error', e); }
    }
  }
  return Array.isArray(specs) ? specs : [];
}

function getFixedAb(speciesObj) {
  const out = {};
  if (!speciesObj || !Array.isArray(speciesObj.ability)) return out;
  for (const entry of speciesObj.ability) {
    if (entry && typeof entry === 'object' && entry.choose == null) {
      for (const s of AB) {
        if (entry[s] != null) out[s] = (out[s] || 0) + Number(entry[s]);
      }
    }
  }
  return out;
}

function getChooseAb(speciesObj) {
  if (!speciesObj || !Array.isArray(speciesObj.ability)) return [];
  return speciesObj.ability.filter(e => e && typeof e === 'object' && e.choose != null);
}

function isSel(choices, key, value) {
  const v = choices[key];
  if (Array.isArray(v)) return v.includes(value);
  return v === value;
}

export default function SpeciesTab() {
  const fullCtx = useCharbuilderContext();
  const { speciesName, speciesSource, speciesObj, allSpecies, choices, loading, selectSpecies, toggleChoice, selectChoice, loadSpeciesData } = fullCtx;
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!Array.isArray(allSpecies) || allSpecies.length === 0) loadSpeciesData();
  }, []);

  const filtered = useMemo(() => {
    if (!Array.isArray(allSpecies)) return [];
    const q = search.toLowerCase().trim();
    if (!q) return allSpecies;
    return allSpecies.filter(s => s.name.toLowerCase().includes(q) || (s.source || '').toLowerCase().includes(q));
  }, [allSpecies, search]);

  const choiceSpecs = useMemo(() => getChoiceSpecs(speciesObj), [speciesObj]);
  const fixedAb = useMemo(() => getFixedAb(speciesObj), [speciesObj]);
  const chooseAb = useMemo(() => getChooseAb(speciesObj), [speciesObj]);

  const fixedAbParts = AB.filter(s => fixedAb[s]).map(s => `${AB_LABEL[s]}+${fixedAb[s]}`);

  const infoTags = [];
  if (speciesObj) {
    const sz = speciesObj.size;
    if (sz) infoTags.push({ label: (Array.isArray(sz) ? sz : [sz]).join('/'), color: 'var(--text2, #c4b393)' });
    if (speciesObj.speed) infoTags.push({ label: `${speciesObj.speed} ft.`, color: 'var(--text2, #c4b393)' });
  }

  function renderChoice(key, label, from, options, count, type) {
    if (type === 'ability_choice') {
      const fromList = Array.isArray(from) ? from : AB;
      return (
        <div key={key} style={S.section}>
          <div style={S.sectionTitle}>{label}</div>
          <div style={S.abGrid}>
            {fromList.map(s => (
              <div key={s} style={{ ...S.abBtn, ...(isSel(choices, key, s) ? S.abBtnActive : {}) }}
                onClick={() => { if (choices[key] === s) selectChoice(key, null); else selectChoice(key, s); }}>
                {AB_LABEL[s]}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (type === 'option') {
      const opts = Array.isArray(options) ? options : [];
      return (
        <div key={key} style={S.section}>
          <div style={S.sectionTitle}>{label}</div>
          <div style={S.choiceGrid}>
            {opts.map((opt, i) => (
              <div key={i} style={{ ...S.chip, ...(choices[key] === opt.key ? S.chipActive : {}) }}
                onClick={() => { if (choices[key] === opt.key) selectChoice(key, null); else selectChoice(key, opt.key); }}>
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      );
    }

    const fromList = Array.isArray(from) ? from : [];
    const maxCount = Number(count) || 1;
    const cur = (() => { const v = choices[key]; if (Array.isArray(v)) return v; return v != null ? [v] : []; })();
    const remaining = maxCount - cur.length;
    const single = maxCount <= 1;
    return (
      <div key={key} style={S.section}>
        <div style={S.sectionTitle}>{label}</div>
        {!single && (
          <div style={{ fontSize: 11, color: 'var(--text3, #8f7a57)', marginBottom: 6 }}>
            {remaining > 0 ? `Select ${remaining} more` : 'Selection complete'}
          </div>
        )}
        <div style={S.choiceGrid}>
          {fromList.map((item, i) => {
            const sel = cur.includes(item);
            const disabled = !sel && remaining <= 0 && !single;
            return (
              <div key={i} style={{ ...S.chip, ...(sel ? S.chipActive : {}), ...(disabled ? { opacity: 0.4, cursor: 'not-allowed' } : {}) }}
                onClick={() => {
                  if (disabled) return;
                  if (single) { if (cur[0] === item) selectChoice(key, null); else selectChoice(key, item); }
                  else toggleChoice(key, item);
                }}>
                {item}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <div style={S.leftCol}>
        <input style={S.search} placeholder="Search species..." value={search} onChange={e => setSearch(e.target.value)} />
        {loading.species ? (
          <div style={S.loading}>Loading species data...</div>
        ) : (
          <div style={S.list}>
            {filtered.map((sp, i) => {
              const sel = speciesName === sp.name && speciesSource === sp.source;
              return (
                <div key={`${sp.name}_${sp.source || ''}_${i}`} style={{ ...S.row, ...(sel ? S.rowSelected : {}) }}
                  onClick={() => selectSpecies(sp.name, sp.source)}>
                  <span style={S.rowName}>{sp.name}</span>
                  <span style={S.rowSource}>{sp.source}</span>
                </div>
              );
            })}
            {filtered.length === 0 && <div style={S.empty}>No species match your search.</div>}
          </div>
        )}
        {speciesObj && <InfoCard item={speciesObj} tags={infoTags} />}
      </div>

      <div style={S.rightCol}>
        {!speciesObj ? (
          <div style={S.empty}>Select a species above to configure its options.</div>
        ) : (
          <>
            {(chooseAb.length > 0 || fixedAbParts.length > 0) && (
              <div style={S.section}>
                <div style={S.sectionTitle}>Ability Score Bonuses</div>
                {fixedAbParts.length > 0 && <div style={S.fixedBonus}>Fixed: {fixedAbParts.join(', ')}</div>}
                {chooseAb.map((entry, idx) => {
                  const from = Array.isArray(entry.from) ? entry.from : AB;
                  return (
                    <div key={`ab_choose_${idx}`} style={{ marginBottom: 8 }}>
                      <div style={S.choiceLabel}>
                        Choose {entry.choose > 1 ? `${entry.choose} ` : ''}Ability{entry.choose > 1 ? 'ies' : ''}
                      </div>
                      <div style={S.abGrid}>
                        {from.map(s => (
                          <div key={s} style={{ ...S.abBtn, ...(isSel(choices, `species_ab_${idx}`, s) ? S.abBtnActive : {}) }}
                            onClick={() => {
                              const k = `species_ab_${idx}`;
                              if (choices[k] === s) selectChoice(k, null); else selectChoice(k, s);
                            }}>
                            {AB_LABEL[s]}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {choiceSpecs.map(sp => renderChoice(sp.key, sp.label, sp.from, sp.options, sp.count, sp.type))}

            {chooseAb.length === 0 && choiceSpecs.length === 0 && (
              <div style={S.empty}>No additional choices for this species.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
