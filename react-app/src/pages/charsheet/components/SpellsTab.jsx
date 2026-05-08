import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Plus, Search, X, Dices, Flame, Cross } from 'lucide-react';
import { FULL_SLOTS, HALF_SLOTS, PACT_SLOTS, SPELL_LEVEL_LABELS, THIRD_SLOTS } from '../../charbuilder/constants.js';
import { SCHOOL_LABELS, SLBL, getFinal, getMod, getPB } from '../logic/calculations.js';
import { loadSpells } from '../../charbuilder/logic/dataLoaders.js';
import { spellMatchesAnyClass } from '../../charbuilder/spells/spells.js';
import { installedRegistry, loadClassAdapters, loadCoreAdapters, loadSpellsAdapters } from '../../../adapters/index.js';

export default function SpellsTab({ C, sheet, onUpdateSpells, onShowToast }) {
  const [spellDb, setSpellDb] = useState([]);
  const [classSpellIndex, setClassSpellIndex] = useState({});
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerLevel, setPickerLevel] = useState(0);
  const [slotUsed, setSlotUsed] = useState(sheet?.spellSlotUsed || {});

  const classNames = useMemo(() => [C?.className, ...(C?.extraClasses || []).map((extra) => extra.name)].filter(Boolean), [C]);

  useEffect(() => {
    let alive = true;
    Promise.all([
      loadCoreAdapters(),
      loadClassAdapters(classNames),
      loadSpellsAdapters(),
      loadSpells(),
    ]).then(([, , result]) => {
      if (!alive) return;
      setSpellDb(result.spells || []);
      setClassSpellIndex(result.classSpellIndex || {});
    }).catch(() => {
      if (alive) setSpellDb([]);
    });
    return () => { alive = false; };
  }, [classNames]);

  useEffect(() => {
    setSlotUsed(sheet?.spellSlotUsed || {});
  }, [sheet?.spellSlotUsed]);

  const spellIndex = useMemo(() => {
    const map = new Map();
    spellDb.forEach((spell) => { if (spell?.name) map.set(norm(spell.name), spell); });
    (C?.spellSnapshots || []).forEach((spell) => {
      if (spell?.name && !map.has(norm(spell.name))) map.set(norm(spell.name), spell);
    });
    return map;
  }, [spellDb, C?.spellSnapshots]);

  const spellInfo = useMemo(() => buildSpellInfo(C, spellIndex), [C, spellIndex]);
  const slots = useMemo(() => getSheetSlots(C), [C]);
  const expandedSpellInfo = useMemo(() => {
    if (!spellInfo) return spellInfo;
    const maxRegular = (slots.regular || []).reduce((m, c, i) => c > 0 ? i + 1 : m, 0);
    const maxPact = slots.pact?.level || 0;
    const maxSlotLv = Math.max(maxRegular, maxPact);
    if (maxSlotLv <= 0) return spellInfo;

    const result = {
      cantrips: spellInfo.cantrips,
      atWill: spellInfo.atWill,
      leveled: {},
      lockedNames: spellInfo.lockedNames,
      lockedEntries: spellInfo.lockedEntries,
    };
    Object.entries(spellInfo.leveled).forEach(([level, entries]) => { result.leveled[level] = [...entries]; });

    Object.entries(spellInfo.leveled).forEach(([level, entries]) => {
      entries.forEach((entry) => {
        if (entry.level <= 0) return;
        if (!entry.entriesHigherLevel) return;
        for (let lv = Number(level) + 1; lv <= maxSlotLv; lv++) {
          if (slots.regular[lv - 1] > 0 || (slots.pact?.level === lv && slots.pact.count > 0)) {
            if (!result.leveled[lv]) result.leveled[lv] = [];
            result.leveled[lv].push({ ...entry, castLevel: lv });
          }
        }
      });
    });
    return result;
  }, [spellInfo, slots]);
  const maxSpellLevel = useMemo(() => getMaxLearnableSpellLevel(C), [C]);
  const limits = useMemo(() => getSpellLimits(C), [C]);
  const canManageSpellList = useMemo(() => canManageSpells(C, limits), [C, limits]);
  const ability = getSpellAbility(C);
  const spellMod = getMod(getFinal(C, ability));
  const dc = 8 + getPB(C) + spellMod;
  const atk = getPB(C) + spellMod;

  useEffect(() => {
    if (pickerLevel > 0 && pickerLevel > maxSpellLevel) setPickerLevel(maxSpellLevel > 0 ? maxSpellLevel : 0);
  }, [pickerLevel, maxSpellLevel]);

  const pickerList = useMemo(() => {
    const q = pickerSearch.trim().toLowerCase();
    const hasIndex = Object.keys(classSpellIndex).length > 0;
    const lockedByLevel = (spellInfo.lockedEntries || []).filter((spell) => Number(spell.level || 0) === pickerLevel);
    const base = spellDb
      .filter((spell) => Number(spell.level || 0) === pickerLevel)
      .filter((spell) => Number(spell.level || 0) === 0 || Number(spell.level || 0) <= maxSpellLevel)
      .filter((spell) => !hasIndex || !classNames.length || spellMatchesAnyClass(spell, classNames, classSpellIndex))
      .filter((spell) => !q || spell.name.toLowerCase().includes(q) || String(spell.schoolFull || spell.school || '').toLowerCase().includes(q));
    return dedupeSpells([...lockedByLevel, ...base])
      .filter((spell) => !q || spell.name.toLowerCase().includes(q) || String(spell.schoolFull || spell.school || '').toLowerCase().includes(q))
      .slice(0, 200);
  }, [spellDb, pickerLevel, pickerSearch, classNames, classSpellIndex, maxSpellLevel, spellInfo.lockedEntries]);

  const selectedManualNames = new Set([
    ...(C?.selectedCantrips || []),
    ...Object.values(C?.selectedSpells || {}).flat(),
  ]);

  const toggleSlot = (level, total, index) => {
    const used = slotUsed[level] || 0;
    const nextUsed = index < used ? Math.max(0, index) : index + 1;
    const next = { ...slotUsed, [level]: nextUsed };
    setSlotUsed(next);
    localStorage.setItem('5e_slots_used', JSON.stringify(next));
  };

  const addSpell = (spell) => {
    const level = Number(spell?.level || 0);
    const name = spell?.name;
    if (!name || selectedManualNames.has(name)) return;
    if (level > 0 && level > maxSpellLevel) return;
    if (level === 0 && limits.cantrips != null && (C?.selectedCantrips || []).length >= limits.cantrips) return;
    if (level > 0 && limits.spells != null && Object.values(C?.selectedSpells || {}).flat().length >= limits.spells) return;

    const nextCantrips = level === 0 ? [...(C?.selectedCantrips || []), name] : (C?.selectedCantrips || []);
    const nextSpells = { ...(C?.selectedSpells || {}) };
    if (level > 0) nextSpells[level] = [...(nextSpells[level] || []), name];
    const nextSnapshots = upsertSnapshot(C?.spellSnapshots || [], toSnapshot(spell));
    onUpdateSpells?.({ selectedCantrips: nextCantrips, selectedSpells: nextSpells, spellSnapshots: nextSnapshots });
  };

  const removeSpell = (spell) => {
    const name = spell?.name;
    const level = Number(spell?.level || 0);
    if (!name || !selectedManualNames.has(name)) return;
    const nextCantrips = level === 0 ? (C?.selectedCantrips || []).filter((entry) => entry !== name) : (C?.selectedCantrips || []);
    const nextSpells = { ...(C?.selectedSpells || {}) };
    if (level > 0) {
      nextSpells[level] = (nextSpells[level] || []).filter((entry) => entry !== name);
      if (!nextSpells[level].length) delete nextSpells[level];
    }
    const stillUsed = new Set([...nextCantrips, ...Object.values(nextSpells).flat(), ...spellInfo.lockedNames]);
    const nextSnapshots = (C?.spellSnapshots || []).filter((snap) => stillUsed.has(snap.name));
    onUpdateSpells?.({ selectedCantrips: nextCantrips, selectedSpells: nextSpells, spellSnapshots: nextSnapshots });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 0.75, flexWrap: 'wrap' }}>
        <StatBox value={dc} label="Spell DC" />
        <StatBox value={formatBonus(atk)} label="Spell Attack" />
        <StatBox value={SLBL[ability] || ability.toUpperCase()} label="Spell Ability" />
      </Box>

      <SlotPanel slots={slots} used={slotUsed} onToggle={toggleSlot} />

      <SpellSection title="Cantrip">
        {spellInfo.cantrips.map((entry) => <SpellEntry key={entry.name} entry={entry} onShowToast={onShowToast} atk={atk} spellMod={spellMod} C={C} />)}
        {!spellInfo.cantrips.length ? <Empty text="None" /> : null}
      </SpellSection>

      {spellInfo.atWill.length ? (
        <SpellSection title="At Will">
          {spellInfo.atWill.map((entry) => <SpellEntry key={`at-will-${entry.name}`} entry={entry} onShowToast={onShowToast} atk={atk} spellMod={spellMod} C={C} />)}
        </SpellSection>
      ) : null}

      {Object.entries(expandedSpellInfo.leveled).map(([level, entries]) => (
        <SpellSection key={level} title={SPELL_LEVEL_LABELS[level] || `Level ${level}`}>
          {entries.map((entry) => <SpellEntry key={`${level}-${entry.name}-${entry.castLevel || 'base'}`} entry={entry} onShowToast={onShowToast} atk={atk} spellMod={spellMod} C={C} />)}
        </SpellSection>
      ))}

      {!spellInfo.cantrips.length && !Object.keys(spellInfo.leveled).length && !spellInfo.atWill.length ? <Empty text="No spells selected." /> : null}

      {canManageSpellList ? (
        <Box sx={{ mt: 0.75 }}>
          <Button onClick={() => setPickerOpen(true)} startIcon={<Plus size={15} />} sx={addButtonSx}>
            Add / Remove Spell
          </Button>
        </Box>
      ) : null}

      <Dialog open={pickerOpen} onClose={() => setPickerOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontFamily: '"Cinzel", Georgia, serif', color: '#edd48a' }}>
          Spells
          <Box sx={{ flex: 1 }} />
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            Cantrips {(C?.selectedCantrips || []).length}/{limits.cantrips ?? '-'} - Spells {Object.values(C?.selectedSpells || {}).flat().length}/{limits.spells ?? '-'}
          </Typography>
          <IconButton onClick={() => setPickerOpen(false)}><X size={18} /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '210px minmax(0,1fr)' }, gap: 0.5, mb: 0.75 }}>
            <ToggleButtonGroup size="small" exclusive value={pickerLevel} onChange={(_, next) => next != null && setPickerLevel(next)} sx={levelToggleSx}>
              {SPELL_LEVEL_LABELS.map((label, level) => (
                <ToggleButton key={label} value={level} disabled={level > 0 && level > maxSpellLevel}>
                  {level === 0 ? 'Can' : level}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <TextField
              size="small"
              fullWidth
              placeholder={spellDb.length ? 'Search spells...' : 'Loading spells...'}
              value={pickerSearch}
              onChange={(event) => setPickerSearch(event.target.value)}
              InputProps={{ startAdornment: <Search size={14} /> }}
              sx={compactInputSx}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '58vh', overflowY: 'auto' }}>
            {pickerList.map((spell) => {
              const manualSelected = selectedManualNames.has(spell.name);
              const locked = spellInfo.lockedNames.has(spell.name);
              const selected = manualSelected || locked;
              const atLimit = !selected && !locked && ((spell.level === 0 && limits.cantrips != null && (C?.selectedCantrips || []).length >= limits.cantrips)
                || (spell.level > 0 && limits.spells != null && Object.values(C?.selectedSpells || {}).flat().length >= limits.spells)
                || (spell.level > 0 && spell.level > maxSpellLevel));
              return (
                <Box key={`${spell.name}-${spell.source}`} onClick={() => manualSelected ? removeSpell(spell) : (!locked && !atLimit ? addSpell(spell) : null)}
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: '9px', py: '6px', border: 1, borderColor: selected ? '#58b879' : 'transparent', borderRadius: 1, bgcolor: selected ? 'rgba(39,174,96,0.08)' : 'transparent', opacity: atLimit ? 0.5 : 1, cursor: locked || atLimit ? 'not-allowed' : 'pointer', '&:hover': { borderColor: selected ? '#58b879' : 'divider', bgcolor: selected ? 'rgba(39,174,96,0.08)' : 'rgba(35,32,26,1)' } }}>
                  <Typography sx={{ flex: 1, minWidth: 0, fontSize: '0.875rem', color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{spell.name}</Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', flexShrink: 0 }}>{SPELL_LEVEL_LABELS[spell.level] || `Lv ${spell.level}`}</Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', flexShrink: 0 }}>{SCHOOL_LABELS[spell.school] || spell.school}</Typography>
                  <Box sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.7rem', color: selected ? '#58b879' : '#edd48a', flexShrink: 0 }}>
                    {locked ? 'AUTO' : selected ? 'ON' : atLimit ? 'MAX' : '+'}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

function buildSpellInfo(C, spellIndex) {
  const rows = new Map();
  const lockedNames = new Set();
  const push = (name, source, locked = false, castLevel = null, fallbackLevel = 0) => {
    const full = spellIndex.get(norm(name));
    const spell = { ...(full || {}), name, level: Number(full?.level ?? fallbackLevel ?? 0) };
    const key = `${name}|${castLevel || spell.level}|${source?.label || ''}`;
    if (!rows.has(key)) rows.set(key, { ...spell, sourceInfo: source, castLevel });
    if (locked) lockedNames.add(name);
  };

  (C?.selectedCantrips || []).forEach((name) => pushKnown(name, 0, null));
  Object.entries(C?.selectedSpells || {}).forEach(([level, names]) => {
    (names || []).forEach((name) => pushKnown(name, Number(level), null));
  });
  (C?.extraClasses || []).forEach((ec) => {
    (ec.selectedCantrips || []).forEach((name) => pushKnown(name, 0, { label: ec.name || 'Class', color: '#9d7fb8' }));
    Object.entries(ec.selectedSpells || {}).forEach(([level, names]) => {
      (names || []).forEach((name) => pushKnown(name, Number(level), { label: ec.name || 'Class', color: '#9d7fb8' }));
    });
  });

  collectChoiceSpells(C, spellIndex).forEach(({ name, source }) => push(name, source, true));
  collectAutoGrantedSpells(C, spellIndex).forEach(({ name, level, source }) => push(name, source, true, null, level));
  collectAtWillSpells(C).forEach(({ name, source }) => push(name, source, true));

  const all = [...rows.values()];
  const cantrips = all.filter((entry) => Number(entry.level || 0) === 0 && entry.sourceInfo?.kind !== 'atWill').sort(sortByName);
  const atWill = all.filter((entry) => entry.sourceInfo?.kind === 'atWill').sort(sortByName);
  const leveled = {};
  all.filter((entry) => Number(entry.level || 0) > 0 && entry.sourceInfo?.kind !== 'atWill').forEach((entry) => {
    const level = Number(entry.level || 0);
    if (!leveled[level]) leveled[level] = [];
    leveled[level].push(entry);
  });
  Object.values(leveled).forEach((entries) => entries.sort(sortByName));
  return { cantrips, atWill, leveled, lockedNames, lockedEntries: all.filter((entry) => lockedNames.has(entry.name)) };

  function pushKnown(name, level, source) {
    const full = spellIndex.get(norm(name));
    if (full) push(name, source);
    else {
      const key = `${name}|${level}|${source?.label || ''}`;
      if (!rows.has(key)) rows.set(key, { name, level: Number(level || 0), sourceInfo: source });
    }
  }
}

function collectChoiceSpells(C, spellIndex) {
  const out = [];
  Object.entries(C?.choices || {}).forEach(([key, value]) => {
    const values = Array.isArray(value) ? value : [value];
    values.forEach((entry) => {
      if (typeof entry !== 'string') return;
      const name = entry.split('|')[0].trim();
      if (!name) return;
      if (!spellIndex.has(norm(name)) && !/(spell|cantrip|tome|magical|known|prepared|innate|expanded)/i.test(key)) return;
      if (['str', 'dex', 'con', 'int', 'wis', 'cha'].includes(norm(name))) return;
      out.push({ name, source: sourceFromChoiceKey(C, key) });
  });
  });
  return out;
}

function collectAutoGrantedSpells(C, spellIndex) {
  const out = [];
  (C?.autoGrantedSpells || []).forEach((entry) => {
    if (entry?.name) out.push({ name: entry.name, level: Number(entry.level ?? 0), source: { label: entry.source || 'Auto', color: '#70b7a6' } });
  });
  const entities = [{ className: C?.className, subclassShortName: C?.subclassShortName, level: C?.classLevel || C?.level || 1 }];
  (C?.extraClasses || []).forEach((ec) => entities.push({ className: ec.name, subclassShortName: ec.subclassShortName, level: ec.level || 1 }));
  entities.forEach((entity) => {
    const cfgs = [
      installedRegistry.getClassRuntimeConfig(entity.className),
      installedRegistry.getSubclassRuntimeConfig(entity.className, entity.subclassShortName),
    ];
    cfgs.forEach((cfg) => {
      [...(cfg?.spellcasting?.alwaysKnownSpells || []), ...(cfg?.spellcasting?.alwaysPreparedSpells || [])].forEach((spell) => {
        const name = typeof spell === 'string' ? spell : spell?.name;
        if (!name || entity.level < Number(spell?.minLevel || 1)) return;
        out.push({ name, level: Number(spell?.level ?? 0), source: { label: entity.subclassShortName || entity.className || 'Auto', color: '#70b7a6' } });
      });
    });
  });
  return out;
}

function collectAtWillSpells(C) {
  const out = [];
  const choices = Object.entries(C?.choices || {});
  const hasInvocation = (name) => choices.some(([key, value]) => key.replace(/^mc\d+_/, '').startsWith('warlock_invocation_') && String(value).split('|')[0].trim() === name);
  const entities = [{ name: C?.className, level: C?.classLevel || C?.level || 1 }, ...(C?.extraClasses || []).map((ec) => ({ name: ec.name, level: ec.level || 1 }))];
  entities.forEach((entity) => {
    (installedRegistry.getClassAtWillSpells(entity.name) || []).forEach((entry) => {
      if (entity.level < Number(entry.minLevel || 1)) return;
      if (entry.invocation && !hasInvocation(entry.invocation)) return;
      out.push({ name: entry.spell, source: { label: entry.invocation || 'At Will', color: '#9d7fb8', kind: 'atWill' } });
    });
  });
  return out;
}

function sourceFromChoiceKey(C, key) {
  const grantKey = key.match(/^(.*)_(known|innate|prepared|expanded)_/i)?.[1];
  const featName = grantKey ? C?.choices?.[grantKey] : null;
  if (featName) return { label: String(featName), color: '#caa550' };
  if (key.startsWith('feat_')) return { label: 'Feat', color: '#caa550' };
  if (key.startsWith('subclass_')) return { label: C?.subclassShortName || 'Subclass', color: '#9d7fb8' };
  if (key.startsWith('species_')) return { label: C?.speciesName || 'Species', color: '#70b7a6' };
  if (key.includes('tome')) return { label: 'Pact of the Tome', color: '#9d7fb8' };
  return { label: 'Choice', color: '#9d7fb8' };
}

function getSpellAbility(C) {
  const clsCfg = installedRegistry.getClassRuntimeConfig(C?.className)?.spellcasting;
  const subCfg = installedRegistry.getSubclassRuntimeConfig(C?.className, C?.subclassShortName)?.spellcasting;
  return String(subCfg?.ability || clsCfg?.ability || C?.choices?.species_spell_ability || 'cha').toLowerCase();
}

function getSpellLimits(C) {
  const totals = getSpellEntities(C).reduce((sum, entity) => {
    const level = clampLevel(entity.level);
    const profile = getSpellcastingProfile(entity);
    if (!hasSpellcastingProfile(profile)) return sum;
    const cantrips = profile.cantripKnown?.[level - 1] ?? profile.cantripProgression?.[level - 1] ?? null;
    const spells = profile.spellsKnown?.[level - 1] ?? profile.preparedSpellsProgression?.[level - 1] ?? null;
    return {
      cantrips: addLimit(sum.cantrips, cantrips),
      spells: addLimit(sum.spells, spells),
    };
  }, { cantrips: null, spells: null });
  return totals;
}

function getSheetSlots(C) {
  const entities = getSpellEntities(C);
  const casterEntities = entities
    .map((entity) => ({ ...entity, profile: getSpellcastingProfile(entity) }))
    .filter((entity) => hasSpellcastingProfile(entity.profile));
  if (!casterEntities.length) return { regular: [], pact: null };

  const pactEntity = casterEntities.find((entity) => normalizeProgression(entity.profile.casterProgression) === 'pact');
  const pact = pactEntity ? pactSlots(clampLevel(pactEntity.level)) : null;

  const regularEntities = casterEntities.filter((entity) => normalizeProgression(entity.profile.casterProgression) !== 'pact');
  if (!regularEntities.length) return { regular: [], pact };

  if (casterEntities.length === 1 && !pactEntity) {
    const entity = regularEntities[0];
    const level = clampLevel(entity.level);
    const prog = normalizeProgression(entity.profile.casterProgression);
    if (prog === 'full') return { regular: FULL_SLOTS[level] || [], pact };
    if (prog === 'half') return { regular: HALF_SLOTS[level] || [], pact };
    if (prog === 'third') return { regular: THIRD_SLOTS[level] || [], pact };
    if (prog === 'artificer') return { regular: HALF_SLOTS[level] || [], pact };
  }

  const casterLevel = regularEntities.reduce((sum, entity) => (
    sum + casterContribution(normalizeProgression(entity.profile.casterProgression), clampLevel(entity.level))
  ), 0);
  return { regular: casterLevel > 0 ? FULL_SLOTS[Math.min(20, casterLevel)] || [] : [], pact };
}

function getMaxCastableSpellLevel(slots) {
  const regularMax = (slots?.regular || []).reduce((max, count, index) => (count ? index + 1 : max), 0);
  return Math.max(regularMax, Number(slots?.pact?.level || 0));
}

function getMaxLearnableSpellLevel(C) {
  return getSpellEntities(C).reduce((max, entity) => {
    const profile = getSpellcastingProfile(entity);
    const level = clampLevel(entity.level);
    const prog = normalizeProgression(profile.casterProgression);
    if (prog === 'pact') return Math.max(max, Number(pactSlots(level).level || 0));
    if (prog === 'full') return Math.max(max, getMaxCastableSpellLevel({ regular: FULL_SLOTS[level] || [] }));
    if (prog === 'half') return Math.max(max, getMaxCastableSpellLevel({ regular: HALF_SLOTS[level] || [] }));
    if (prog === 'third') return Math.max(max, getMaxCastableSpellLevel({ regular: THIRD_SLOTS[level] || [] }));
    if (prog === 'artificer') return Math.max(max, getMaxCastableSpellLevel({ regular: HALF_SLOTS[level] || [] }));
    return max;
  }, 0);
}

function canManageSpells(C, limits) {
  if (!C) return false;
  if ((limits.cantrips || 0) > 0 || (limits.spells || 0) > 0) return true;
  if ((C.selectedCantrips || []).length || Object.values(C.selectedSpells || {}).flat().length) return true;
  return getSpellEntities(C).some((entity) => hasSpellcastingProfile(getSpellcastingProfile(entity)));
}

function getSpellEntities(C) {
  if (!C) return [];
  return [
    {
      className: C.className,
      subclassShortName: C.subclassShortName,
      level: C.classLevel || C.level || 1,
      snapshot: C.clsSnapshot,
    },
    ...(C.extraClasses || []).map((extra) => ({
      className: extra.name,
      subclassShortName: extra.subclassShortName,
      level: extra.level || 1,
      snapshot: extra.clsSnapshot || extra.cls,
    })),
  ].filter((entity) => entity.className);
}

function getSpellcastingProfile(entity) {
  const classCfg = installedRegistry.getClassRuntimeConfig(entity.className)?.spellcasting || {};
  const subCfg = installedRegistry.getSubclassRuntimeConfig(entity.className, entity.subclassShortName)?.spellcasting || {};
  return {
    ...classCfg,
    ...subCfg,
    casterProgression: subCfg.casterProgression || classCfg.casterProgression || entity.snapshot?.casterProgression,
    cantripProgression: entity.snapshot?.cantripProgression,
    preparedSpellsProgression: subCfg.preparedSpellsProgression || classCfg.preparedSpellsProgression || entity.snapshot?.preparedSpellsProgression,
    alwaysKnownSpells: [
      ...(classCfg.alwaysKnownSpells || []),
      ...(subCfg.alwaysKnownSpells || []),
    ],
    alwaysPreparedSpells: [
      ...(classCfg.alwaysPreparedSpells || []),
      ...(subCfg.alwaysPreparedSpells || []),
    ],
  };
}

function hasSpellcastingProfile(profile) {
  return Boolean(
    normalizeProgression(profile?.casterProgression)
    || profile?.cantripKnown
    || profile?.cantripProgression
    || profile?.spellsKnown
    || profile?.preparedSpellsProgression
    || profile?.alwaysKnownSpells?.length
    || profile?.alwaysPreparedSpells?.length
  );
}

function addLimit(a, b) {
  if (b == null) return a;
  return Number(a || 0) + Number(b || 0);
}

function clampLevel(level) {
  return Math.max(1, Math.min(20, Number(level || 1)));
}

function casterContribution(prog, level) {
  if (prog === 'full') return level;
  if (prog === 'half') return Math.floor(level / 2);
  if (prog === 'artificer') return Math.ceil(level / 2);
  if (prog === 'third') return Math.floor(level / 3);
  return 0;
}

function pactSlots(level) {
  const row = PACT_SLOTS[Math.min(level, 20)] || {};
  return { count: row.slots || row.n || 0, level: row.level || row.l || 1 };
}

function normalizeProgression(value) {
  const v = String(value || '').toLowerCase();
  if (v === '1/2') return 'half';
  if (v === '1/3') return 'third';
  return v;
}

function SlotPanel({ slots, used, onToggle }) {
  const hasRegular = (slots.regular || []).some(Boolean);
  const hasPact = slots.pact && slots.pact.count > 0;
  if (!hasRegular && !hasPact) return null;
  return (
    <Box sx={{ mb: 0.75 }}>
      {hasRegular ? (
        <>
          <Typography sx={{ ...levelHeaderSx, color: '#caa550', borderColor: 'rgba(202,165,80,0.18)' }}>Spell Slots</Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.4 }}>
            {slots.regular.map((total, idx) => total ? <SlotGroup key={idx + 1} level={idx + 1} total={total} used={used[idx + 1] || 0} onToggle={onToggle} /> : null)}
          </Box>
        </>
      ) : null}
      {hasPact ? (
        <>
          <Typography sx={{ ...levelHeaderSx, color: '#9d7fb8', borderColor: 'rgba(157,127,184,0.22)', mt: hasRegular ? 0.75 : 0 }}>Pact Slots ({slots.pact.count}x {slots.pact.level})</Typography>
          <SlotGroup level={slots.pact.level} total={slots.pact.count} used={used[slots.pact.level] || 0} onToggle={onToggle} />
        </>
      ) : null}
    </Box>
  );
}

function SlotGroup({ level, total, used, onToggle }) {
  return (
    <Box>
      <Box sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.56rem', color: 'text.secondary', textAlign: 'center', mb: '3px' }}>{level}</Box>
      <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {Array.from({ length: total }, (_, index) => (
          <Box key={index} onClick={() => onToggle(level, total, index)} sx={{ width: 14, height: 14, borderRadius: '50%', border: 1, borderColor: index < used ? '#4d95d6' : 'divider', bgcolor: index < used ? '#4d95d6' : 'transparent', cursor: 'pointer' }} />
        ))}
      </Box>
    </Box>
  );
}

function SpellSection({ title, children }) {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography sx={levelHeaderSx}>{title}</Typography>
      {children}
    </Box>
  );
}

function SpellEntry({ entry, onShowToast, atk, spellMod, C }) {
  const [open, setOpen] = useState(false);
  const castLevel = entry.castLevel || entry.level || 0;
  const baseLevel = entry.level || 0;
  const school = SCHOOL_LABELS[entry.school] || entry.school || '';
  const metaLine = getMetaLine(entry);
  const body = renderEntries(entry.entries);
  const higherBody = entry.entriesHigherLevel ? renderEntries(entry.entriesHigherLevel) : '';
  const rawDamages = extractDamageDice(entry.entries || []);
  const hasAttack = !!entry.spellAttack;
  const spellData = installedRegistry.getSpellData(entry.name);
  const hasHeal = !!spellData?.heal;
  const rawHealFormula = hasHeal ? (spellData?.baseDie || (rawDamages.length > 0 ? rawDamages[0].formula : null)) : null;
  const damages = hasHeal ? [] : rawDamages;
  const hasDamage = damages.length > 0;
  const steps = castLevel - baseLevel;

  const isLifeCleric = C?.className === 'Cleric' && C?.subclassShortName === 'Life';
  const lifeBonus = isLifeCleric && hasHeal ? (2 + castLevel) : 0;
  const healFlat = (hasHeal ? spellMod : 0) + lifeBonus;

  const upcastStepDie = (steps > 0) ? (spellData?.upcastDie || getUpcastStep(entry.entriesHigherLevel)?.stepDie) : null;
  const scaledDamages = upcastStepDie
    ? damages.map(d => ({ ...d, formula: computeScaledFormula(d.formula, upcastStepDie, steps) }))
    : damages;
  const scaledHealFormula = upcastStepDie && rawHealFormula
    ? computeScaledFormula(rawHealFormula, upcastStepDie, steps)
    : rawHealFormula;
  const healDisplayFormula = scaledHealFormula ? scaledHealFormula + (healFlat > 0 ? '+' + healFlat : '') : null;

  const rollAtk = (e) => {
    e.stopPropagation();
    const r = Math.floor(Math.random() * 20) + 1;
    onShowToast(`${entry.name} — Spell Attack`, `d20 + ${atk}`, r + atk, [{ v: r, faces: 20 }]);
  };

  const rollDmg = (e, formula, label) => {
    e.stopPropagation();
    const match = formula.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/);
    if (!match) { onShowToast(`${entry.name} — ${label}`, formula, 0, []); return; }
    const n = parseInt(match[1]);
    const faces = parseInt(match[2]);
    const flat = match[3] ? parseInt(match[3]) : 0;
    let total = 0;
    const rolls = [];
    for (let i = 0; i < n; i++) { const v = Math.floor(Math.random() * faces) + 1; rolls.push({ v, faces }); total += v; }
    total += flat;
    onShowToast(`${entry.name} — ${label}`, formula, total, rolls);
  };

  const rollHeal = (e, formula) => {
    e.stopPropagation();
    if (!formula) { onShowToast(`${entry.name} — Heal`, '', 0, []); return; }
    const match = formula.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/);
    if (!match) { onShowToast(`${entry.name} — Heal`, formula, 0, []); return; }
    const n = parseInt(match[1]);
    const faces = parseInt(match[2]);
    const flat = match[3] ? parseInt(match[3]) : 0;
    let total = 0;
    const rolls = [];
    for (let i = 0; i < n; i++) { const v = Math.floor(Math.random() * faces) + 1; rolls.push({ v, faces }); total += v; }
    total += flat;
    onShowToast(`${entry.name} — Heal`, formula, total, rolls);
  };

  return (
    <Box>
      <Box onClick={() => setOpen(!open)} sx={spellRowSx}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', minWidth: 0 }}>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {entry.name}
          </Typography>
          {castLevel > baseLevel ? <Badge label={SPELL_LEVEL_LABELS[castLevel]} color="#d69245" bg="rgba(214,146,69,0.14)" /> : null}
        </Box>
        {(hasAttack || hasDamage || hasHeal) ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, mr: '6px' }}>
            {hasAttack ? (
              <Button size="small" variant="outlined" color="warning"
                onClick={rollAtk}
                sx={{ fontSize: '0.6rem', minWidth: 0, py: 0.2, px: 0.8, lineHeight: 1.3, borderColor: 'rgba(245,166,35,0.4)', color: '#f5a623' }}>
                <Dices size={12} style={{ marginRight: 2 }} /> +{atk}
              </Button>
            ) : null}
            {scaledDamages.map((dmg, i) => (
              <Button key={i} size="small" variant="outlined"
                onClick={(e) => rollDmg(e, dmg.formula, dmg.label)}
                sx={{ fontSize: '0.6rem', minWidth: 0, py: 0.2, px: 0.8, lineHeight: 1.3, borderColor: 'rgba(255,107,53,0.4)', color: '#ff6b35' }}>
                <Flame size={12} style={{ marginRight: 2 }} /> {dmg.formula}
              </Button>
            ))}
            {hasHeal ? (
              <Button size="small" variant="outlined" color="success"
                onClick={(e) => rollHeal(e, healDisplayFormula)}
                sx={{ fontSize: '0.6rem', minWidth: 0, py: 0.2, px: 0.8, lineHeight: 1.3, borderColor: 'rgba(88,184,121,0.4)', color: '#58b879' }}>
                <Cross size={12} style={{ marginRight: 2 }} /> {healDisplayFormula}
              </Button>
            ) : null}
          </Box>
        ) : null}
        {entry.sourceInfo ? <Badge label={entry.sourceInfo.label} color={entry.sourceInfo.color || '#9d7fb8'} bg="rgba(157,127,184,0.16)" /> : null}
        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
          {school ? <Badge label={school} color="#c4b393" /> : null}
          {entry.concentration ? <Badge label="C" color="#9d7fb8" bg="rgba(157,127,184,0.16)" /> : null}
          {entry.ritual ? <Badge label="R" color="#58b879" bg="rgba(63,166,108,0.14)" /> : null}
          <Badge {...getCastBadge(entry)} />
        </Box>
      </Box>
      {open ? (
        <Box sx={spellBodySx}>
          {metaLine ? <Box sx={{ fontSize: '0.65rem', color: 'text.secondary', mb: '5px' }}>{metaLine}</Box> : null}
          <Box dangerouslySetInnerHTML={{ __html: body }} />
          {higherBody ? (
            <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed', borderColor: 'divider' }}>
              <Box sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', color: '#9d7fb8', mb: 0.5 }}>Higher Level</Box>
              <Box dangerouslySetInnerHTML={{ __html: higherBody }} />
            </Box>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
}

function StatBox({ value, label }) {
  return (
    <Box sx={{ minWidth: 80, bgcolor: 'rgba(35,32,26,1)', border: 1, borderColor: 'divider', borderRadius: 1, px: 1, py: 0.5, textAlign: 'center' }}>
      <Box sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '1rem', fontWeight: 700, color: '#edd48a' }}>{value}</Box>
      <Box sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.56rem', letterSpacing: '0.1em', color: 'text.secondary', textTransform: 'uppercase' }}>{label}</Box>
    </Box>
  );
}

function Badge({ label, color, bg = 'transparent' }) {
  return (
    <Box component="span" sx={{ border: 1, borderColor: color, color, bgcolor: bg, borderRadius: '3px', px: '6px', py: '1px', fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.56rem', lineHeight: 1.35, flexShrink: 0 }}>
      {label}
    </Box>
  );
}

function Empty({ text }) {
  return <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontStyle: 'italic', py: 0.25 }}>{text}</Typography>;
}

const levelHeaderSx = {
  fontFamily: '"Cinzel", Georgia, serif',
  fontSize: '0.65rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: '#4d95d6',
  textTransform: 'uppercase',
  borderBottom: 1,
  borderColor: 'rgba(77,149,214,0.14)',
  pb: '4px',
  mb: 0.4,
};

const spellRowSx = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  px: '8px',
  py: '4px',
  bgcolor: 'rgba(35,32,26,1)',
  border: 1,
  borderColor: 'divider',
  borderRadius: 1,
  mb: '3px',
  color: 'text.primary',
  cursor: 'pointer',
  '&:hover': { borderColor: 'rgba(202,165,80,0.34)' },
};

const spellBodySx = {
  fontSize: '0.7rem',
  color: 'text.secondary',
  lineHeight: 1.5,
  bgcolor: '#12100e',
  border: 1,
  borderColor: 'divider',
  borderTop: 'none',
  borderRadius: '0 0 8px 8px',
  px: '10px',
  py: '6px',
  mt: '-3px',
  mb: '3px',
};

const addButtonSx = {
  bgcolor: 'rgba(202,165,80,0.12)',
  border: 1,
  borderColor: '#caa550',
  borderRadius: 1,
  color: '#caa550',
  fontFamily: '"Cinzel", Georgia, serif',
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  px: '14px',
  py: '5px',
};

const compactInputSx = {
  '& .MuiOutlinedInput-root': { bgcolor: 'rgba(35,32,26,1)', borderRadius: 1 },
  '& input': { fontSize: '0.75rem', py: '7px' },
};

const levelToggleSx = {
  flexWrap: 'wrap',
  '& .MuiToggleButton-root': {
    minHeight: 0,
    px: '9px',
    py: '4px',
    fontFamily: '"Cinzel", Georgia, serif',
    fontSize: '0.58rem',
    letterSpacing: '0.08em',
    color: 'text.secondary',
    borderColor: 'divider',
    '&.Mui-selected': { color: '#edd48a', bgcolor: 'rgba(202,165,80,0.12)', borderColor: '#caa550' },
  },
};

function getCastBadge(spell) {
  const unit = spell?.time?.[0]?.unit || '';
  if (unit === 'bonus') return { label: 'BA', color: '#f5c542' };
  if (unit === 'reaction') return { label: 'RE', color: '#f5a623' };
  if (unit === 'action' || unit === '') return { label: 'A', color: '#4d95d6' };
  return { label: unit, color: '#c4b393' };
}

function getMetaLine(spell) {
  const time = spell?.time?.[0] ? `${spell.time[0].number || 1} ${spell.time[0].unit}` : '';
  const range = formatSpellField(spell?.range);
  const components = formatComponents(spell?.components);
  const duration = formatSpellField(spell?.duration);
  return [time, range, components, duration].filter(Boolean).join(' - ');
}

function formatComponents(components) {
  if (!components || typeof components !== 'object') return '';
  return [components.v ? 'V' : null, components.s ? 'S' : null, components.m ? 'M' : null].filter(Boolean).join(', ');
}

function formatSpellField(value) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(formatSpellField).filter(Boolean).join(', ');
  if (typeof value === 'object') {
    if (value.type && value.amount) return `${value.amount} ${value.type}`;
    if (value.distance) return formatSpellField(value.distance);
    if (value.unit && value.number) return `${value.number} ${value.unit}`;
    if (value.type) return String(value.type);
  }
  return '';
}

function renderEntries(entries) {
  if (!entries) return '';
  if (typeof entries === 'string') return cleanTags(entries);
  if (Array.isArray(entries)) return entries.map((entry) => renderEntries(entry)).join('<br/>');
  if (typeof entries === 'object') {
    if (entries.type === 'list') return `<ul style="margin:0.3rem 0 0.3rem 1.2rem">${(entries.items || []).map((item) => `<li>${renderEntries(item)}</li>`).join('')}</ul>`;
    if (entries.name && entries.entries) return `<b>${cleanTags(entries.name)}.</b> ${renderEntries(entries.entries)}`;
    if (entries.entries) return renderEntries(entries.entries);
  }
  return '';
}

function cleanTags(text) {
  return String(text)
    .replace(/\{@spell ([^|}]+)[^}]*\}/g, '<i>$1</i>')
    .replace(/\{@item ([^|}]+)[^}]*\}/g, '<i>$1</i>')
    .replace(/\{@dice ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@damage ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@hit ([^|}]+)[^}]*\}/g, '+$1')
    .replace(/\{@condition ([^|}]+)[^}]*\}/g, '<i>$1</i>')
    .replace(/\{@creature ([^|}]+)[^}]*\}/g, '<i>$1</i>')
    .replace(/\{@sense ([^|}]+)[^}]*\}/g, '<i>$1</i>')
    .replace(/\{@dc ([^|}]+)[^}]*\}/g, 'DC $1')
    .replace(/\{@atk ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@scaled(?:amage|ice)\s+(\d+d\d+)\|[^}]+\}/g, '$1 per level')
    .replace(/\{@[^}]+\}/g, '');
}

function toSnapshot(spell) {
  return {
    name: spell.name,
    level: spell.level ?? 0,
    school: spell.school,
    source: spell.source,
    components: spell.components,
    duration: spell.duration,
    range: spell.range,
    time: spell.time,
    ritual: !!spell.ritual,
    concentration: !!spell.concentration,
    entries: spell.entries || [],
    entriesHigherLevel: spell.entriesHigherLevel || null,
    scalingLevelDice: spell.scalingLevelDice || null,
    spellAttack: spell.spellAttack || null,
    damageInflict: spell.damageInflict || null,
  };
}

function upsertSnapshot(snapshots, snapshot) {
  const idx = snapshots.findIndex((entry) => norm(entry.name) === norm(snapshot.name));
  if (idx >= 0) return snapshots.map((entry, index) => (index === idx ? { ...entry, ...snapshot } : entry));
  return [...snapshots, snapshot];
}

function parseDice(formula) {
  const match = String(formula).match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/);
  if (!match) return null;
  return { count: parseInt(match[1]), faces: parseInt(match[2]), mod: match[3] ? parseInt(match[3]) : 0 };
}

function formatDice(count, faces, mod) {
  let s = `${count}d${faces}`;
  if (mod) s += `${mod > 0 ? '+' : ''}${mod}`;
  return s;
}

function computeScaledFormula(baseFormula, stepFormula, steps) {
  const b = parseDice(baseFormula);
  const s = parseDice(stepFormula);
  if (!b || !s) return baseFormula;
  return formatDice(b.count + s.count * steps, b.faces, b.mod);
}

function getUpcastStep(entries) {
  const text = JSON.stringify(entries);
  const m = text.match(/\{@scaled(?:amage|ice)\s+(\d+d\d+)\|(\d+-\d+)\|(\d+d\d+)\}/);
  if (m) return { stepDie: m[3], range: m[2], display: m[1] };
  const m2 = text.match(/\{@scaled(?:amage|ice)\s+(\d+d\d+)\|(\d+-\d+)\}/);
  if (m2) return { stepDie: m2[1], range: m2[2], display: m2[1] };
  return null;
}

function extractDamageDice(entries) {
  const out = [];
  const seen = new Set();
  const walk = (node) => {
    if (!node) return;
    if (typeof node === 'string') {
      node.replace(/\{@damage ([^}]+)\}/g, (_, inner) => {
        const formula = inner.trim().replace(/\s+/g, '');
        if (!seen.has(formula)) { seen.add(formula); out.push({ formula, label: formula }); }
        return '';
      });
      return;
    }
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (typeof node === 'object') {
      Object.values(node).forEach(walk);
    }
  };
  walk(entries);
  return out;
}

function formatBonus(value) {
  return value >= 0 ? `+${value}` : String(value);
}

function sortByName(a, b) {
  return String(a.name).localeCompare(String(b.name));
}

function dedupeSpells(spells) {
  const seen = new Set();
  return (spells || []).filter((spell) => {
    const key = norm(spell?.name);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function norm(value) {
  return String(value || '').toLowerCase();
}
