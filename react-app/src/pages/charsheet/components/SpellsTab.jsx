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
import { Plus, Search, X } from 'lucide-react';
import { SPELL_LEVEL_LABELS } from '../../charbuilder/constants.js';
import { SCHOOL_LABELS, SLBL, getFinal, getMod, getPB } from '../logic/calculations.js';
import { loadSpells } from '../../charbuilder/logic/dataLoaders.js';
import { spellMatchesAnyClass } from '../../charbuilder/spells/spells.js';
import { installedRegistry, loadClassAdapters, loadCoreAdapters, loadSpellsAdapters } from '../../../adapters/index.js';
import {
  buildSpellInfo,
  canManageSpells,
  dedupeSpells,
  formatBonus,
  getMaxLearnableSpellLevel,
  getSheetSlots,
  getSpellAbility,
  getSpellLimits,
  norm,
  toSnapshot,
  upsertSnapshot,
} from '../logic/spellsTabLogic.js';
import {
  addButtonSx,
  compactInputSx,
  levelToggleSx,
} from './spellsTabStyles.js';
import SpellEntry from './SpellEntry.jsx';
import { Empty, SlotPanel, SpellSection, StatBox } from './SpellsUiParts.jsx';

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
    const context = { getMod, getFinal, getPB };
    Promise.all([
      loadCoreAdapters(context),
      loadClassAdapters(classNames, context),
      loadSpellsAdapters(context),
      loadSpells(),
    ]).then(([, , , result]) => {
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
        {spellInfo.cantrips.map((entry) => <SpellEntry key={entry.name} entry={entry} onShowToast={onShowToast} atk={atk} spellMod={spellMod} C={C} installedRegistry={installedRegistry} />)}
        {!spellInfo.cantrips.length ? <Empty text="None" /> : null}
      </SpellSection>

      {spellInfo.atWill.length ? (
        <SpellSection title="At Will">
          {spellInfo.atWill.map((entry) => <SpellEntry key={`at-will-${entry.name}`} entry={entry} onShowToast={onShowToast} atk={atk} spellMod={spellMod} C={C} installedRegistry={installedRegistry} />)}
        </SpellSection>
      ) : null}

      {Object.entries(expandedSpellInfo.leveled).map(([level, entries]) => (
        <SpellSection key={level} title={SPELL_LEVEL_LABELS[level] || `Level ${level}`}>
          {entries.map((entry) => <SpellEntry key={`${level}-${entry.name}-${entry.castLevel || 'base'}`} entry={entry} onShowToast={onShowToast} atk={atk} spellMod={spellMod} C={C} installedRegistry={installedRegistry} />)}
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
