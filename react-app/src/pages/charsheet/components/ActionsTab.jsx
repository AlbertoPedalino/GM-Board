import { useEffect, useState } from 'react';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Cross, Dices, Sword } from 'lucide-react';
import { getMod, getFinal, fbonus } from '../logic/calculations.js';
import { installedRegistry, loadCoreAdapters, loadClassAdapters } from '../../../adapters/index.js';
import { setStorageJson } from '../../../shared/storage.js';
import { PACT_SLOTS, SPELL_LEVEL_LABELS } from '../../charbuilder/constants.js';
import { getAllResourceDefs } from '../logic/restResources.js';
import {
  FILTERS,
  CAT_COLORS,
  SECTION_DEFS,
  normalizeResourceMax,
  resolveActionFormulas,
  collectAdapterActions,
  makeWeaponActions,
  resolveFormula,
  resolveButtonLabel,
  rollFormula,
} from '../logic/actionsTabLogic.js';
import { getSheetSlots } from '../logic/spellsTabLogic.js';
import { loadItems } from '../../charbuilder/logic/dataLoaders.js';
import {
  filterChipSx,
  inlineButtonSx,
  levelHeaderSx,
  panelRootSx,
  panelToolbarSx,
  spellBodySx,
  spellRowSx,
  tinyMetaChipSx,
} from './spellsTabStyles.js';
import { Empty } from './SpellsUiParts.jsx';

function actionLabel(value) {
  if (value === 'all') return 'All';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function ActionsTab({ C, sheet, onRoll, resources, setResources, onShowToast, onUpdateSheet }) {
  const [filter, setFilter] = useState('all');
  const [itemsDb, setItemsDb] = useState([]);
  const [slotRecovery, setSlotRecovery] = useState(null);
  const [slotRecoverySelection, setSlotRecoverySelection] = useState({});
  const classNames = [C?.className, ...(C?.extraClasses || []).map((e) => e.name)].filter(Boolean);
  const classNamesKey = classNames.join('|');

  useEffect(() => {
    Promise.all([
      loadCoreAdapters(),
      loadClassAdapters(classNames, { getMod, getFinal }),
    ]);
  }, [classNamesKey]);

  useEffect(() => {
    let alive = true;
    loadItems()
      .then((items) => { if (alive) setItemsDb(items || []); })
      .catch(() => { if (alive) setItemsDb([]); });
    return () => { alive = false; };
  }, []);

  const inv = sheet?.sheetInventory || [];
  const attacks = inv.filter(i => i.equipped && ['M', 'R'].includes(String(i.type || '').toUpperCase()));
  const masteryItems = itemsDb.length ? itemsDb : inv;
  const adapterActions = [
    ...makeWeaponActions(C, attacks, inv, masteryItems),
    ...collectAdapterActions(C),
  ].map((action) => resolveActionFormulas(action, C));
  const showAttacks = false;
  const actionSections = SECTION_DEFS
    .filter(section => filter === 'all' || filter === section.key)
    .map(section => ({
      ...section,
      actions: adapterActions.filter(action => section.cats.includes(action.cat)),
    }))
    .filter(section => section.actions.length > 0);

  const resMaxMap = {};
  const resNameMap = {};
  getAllResourceDefs(C).forEach(def => {
    if (!def.key) return;
    resMaxMap[def.key] = normalizeResourceMax(def, C);
    resNameMap[def.key] = def.name || def.key;
  });

  const slotRecoverySpent = slotRecovery
    ? slotRecovery.levels.reduce((sum, entry) => sum + (entry.level * Number(slotRecoverySelection[String(entry.level)] || 0)), 0)
    : 0;
  const slotRecoveryRemaining = slotRecovery ? Math.max(0, slotRecovery.budget - slotRecoverySpent) : 0;

  const applyPactSlotRecovery = (result) => {
    if (!(result?.recover > 0)) return;
    const level = Number(result.slotLevel || 1);
    const used = { ...(sheet?.spellSlotUsed || {}) };
    const before = Number(used[level] || 0);
    const after = Math.max(0, before - Number(result.recover || 0));
    const recovered = before - after;
    used[level] = after;
    setStorageJson('5e_slots_used', used);
    onUpdateSheet?.({ spellSlotUsed: used });
    if (recovered > 0) {
      const label = result.label || 'Spell Recovery';
      onShowToast?.(label, `Recovered ${recovered} Pact Magic slot${recovered === 1 ? '' : 's'}`, recovered, []);
    } else {
      onShowToast?.(result.label || 'Spell Recovery', 'No expended Pact Magic slots to recover.', 0, []);
    }
  };

  const openSpellSlotRecovery = (result, key) => {
    const budget = Math.max(0, Number(result?.budget || 0));
    if (!budget) return;
    const maxSlotLevel = Math.max(1, Math.min(9, Number(result?.maxSlotLevel || 9)));
    const regularSlots = getSheetSlots(C)?.regular || [];
    const used = sheet?.spellSlotUsed || {};
    const levels = [];
    const topLevel = Math.min(maxSlotLevel, regularSlots.length);
    for (let level = 1; level <= topLevel; level++) {
      const total = Number(regularSlots[level - 1] || 0);
      if (!total) continue;
      const expended = Math.max(0, Math.min(total, Number(used[level] || used[String(level)] || 0)));
      if (!expended) continue;
      levels.push({ level, total, expended });
    }
    if (!levels.length) {
      onShowToast?.(result?.label || resNameMap[key] || 'Spell Recovery', 'No expended eligible spell slots to recover.', 0, []);
      return;
    }
    setSlotRecovery({
      key,
      label: result?.label || resNameMap[key] || 'Spell Recovery',
      budget,
      levels,
    });
    setSlotRecoverySelection(Object.fromEntries(levels.map((entry) => [String(entry.level), 0])));
  };

  const adjustSlotRecoveryLevel = (level, delta) => {
    setSlotRecoverySelection((prev) => {
      if (!slotRecovery) return prev;
      const entry = slotRecovery.levels.find((item) => item.level === level);
      if (!entry) return prev;
      const key = String(level);
      const current = Number(prev[key] || 0);
      if (delta < 0) return { ...prev, [key]: Math.max(0, current - 1) };

      const spent = slotRecovery.levels.reduce((sum, item) => sum + (item.level * Number(prev[String(item.level)] || 0)), 0);
      if (current >= entry.expended) return prev;
      if (spent + level > slotRecovery.budget) return prev;
      return { ...prev, [key]: current + 1 };
    });
  };

  const confirmSlotRecovery = () => {
    if (!slotRecovery) return;
    const used = { ...(sheet?.spellSlotUsed || {}) };
    let recovered = 0;
    const details = [];

    slotRecovery.levels.forEach((entry) => {
      const amount = Math.max(0, Number(slotRecoverySelection[String(entry.level)] || 0));
      if (!amount) return;
      const key = String(entry.level);
      const before = Number(used[key] || 0);
      const after = Math.max(0, before - amount);
      const actual = before - after;
      if (!actual) return;
      used[key] = after;
      recovered += actual;
      details.push(`${actual}× ${SPELL_LEVEL_LABELS[entry.level] || `L${entry.level}`}`);
    });

    setSlotRecovery(null);
    setSlotRecoverySelection({});
    if (!recovered) return;

    setStorageJson('5e_slots_used', used);
    onUpdateSheet?.({ spellSlotUsed: used });
    onShowToast?.(
      slotRecovery.label,
      `Recovered ${recovered} slot${recovered === 1 ? '' : 's'}${details.length ? ` (${details.join(', ')})` : ''}`,
      recovered,
      [],
    );
  };

  const handleResChange = (key, delta) => {
    if (!resources || !setResources) return;
    const max = resMaxMap[key] ?? 1;
    const res = { ...resources };
    res[key] = Math.max(0, Math.min(max, (res[key] || 0) + delta));
    setResources(res);
    setStorageJson('5e_resources', res);

    if (delta < 0) {
      const sideEffect = installedRegistry.getResourceSideEffect(key);
      if (typeof sideEffect === 'function') {
        let result = null;
        try {
          result = sideEffect({ character: C, C, sheet, resources: res, PACT_SLOTS });
        } catch {
          result = null;
        }
        if (result?.type === 'recover_pact_slots') {
          applyPactSlotRecovery(result);
        } else if (result?.type === 'recover_spell_slots') {
          openSpellSlotRecovery(result, key);
        }
      }
    }
  };

  return (
    <Box sx={panelRootSx}>
      <Box sx={panelToolbarSx}>
        <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.12em', color: '#edd48a', textTransform: 'uppercase', mr: 0.25 }}>
          Filter
        </Typography>
        {FILTERS.map(f => (
          <Chip
            key={f}
            size="small"
            label={actionLabel(f)}
            variant={filter === f ? 'filled' : 'outlined'}
            color={filter === f ? 'primary' : 'default'}
            onClick={() => setFilter(f)}
            sx={filterChipSx}
          />
        ))}
      </Box>

      {showAttacks && (
        <Box sx={{ overflow: 'auto' }}>
          <Typography sx={levelHeaderSx}>Attacks</Typography>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <Box component="thead">
              <Box component="tr" sx={{ '& th': { fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'text.secondary', borderBottom: 1, borderColor: 'divider', p: '4px 6px', textAlign: 'left' } }}>
                <Box component="th">Name</Box>
                <Box component="th">Hit</Box>
                <Box component="th">Damage</Box>
              </Box>
            </Box>
            <Box component="tbody">
              {attacks.map((item, i) => {
                const prof = getMod(getFinal(C, 'str')) > getMod(getFinal(C, 'dex')) ? getMod(getFinal(C, 'str')) : getMod(getFinal(C, 'dex'));
                const hitBonus = fbonus(prof);
                return (
                  <Box component="tr" key={i} sx={{ '& td': { p: '6px 6px', borderBottom: 1, borderColor: 'divider', color: 'text.secondary' }, '&:hover td': { bgcolor: 'rgba(35,32,26,1)' } }}>
                    <Box component="td"><Typography sx={{ color: 'text.primary', fontWeight: 600 }}>{item.name}</Typography></Box>
                    <Box component="td"><Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontWeight: 700, color: '#edd48a', fontSize: '0.875rem' }}>{hitBonus}</Typography></Box>
                    <Box component="td"><Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', color: 'text.primary' }}>{item.damage?.[0]?.damage || '—'}</Typography></Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      )}

      {actionSections.map(section => (
        <Box key={section.key} sx={{ minWidth: 0 }}>
          <Typography sx={{ ...levelHeaderSx, color: 'primary.main' }}>
            {section.title}
          </Typography>
          <Box sx={{ display: 'grid', gap: '4px', minWidth: 0 }}>
            {section.actions.map((action, i) => (
              <AdapterActionCard
                key={`${section.key}-${i}`}
                C={C}
                action={action}
                resources={resources}
                onResChange={handleResChange}
                onRoll={onRoll}
                onShowToast={onShowToast}
                resMax={resMaxMap[action.resKey]}
              />
            ))}
          </Box>
        </Box>
      ))}

      {!actionSections.length ? <Empty text="No actions for this filter." /> : null}

      <Dialog open={Boolean(slotRecovery)} onClose={() => setSlotRecovery(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Cinzel", Georgia, serif', color: '#edd48a', bgcolor: 'rgba(35,32,26,1)', borderBottom: 1, borderColor: 'divider' }}>
          {slotRecovery?.label || 'Recover Spell Slots'}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'rgba(26,23,19,0.98)', pt: 1.25 }}>
          {slotRecovery ? (
            <Box sx={{ display: 'grid', gap: 0.75 }}>
              <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                Recover expended spell slots. Budget {slotRecoverySpent}/{slotRecovery.budget}.
              </Typography>
              {slotRecovery.levels.map((entry) => {
                const value = Number(slotRecoverySelection[String(entry.level)] || 0);
                return (
                  <Box key={entry.level} sx={{ display: 'flex', alignItems: 'center', gap: 0.6, border: 1, borderColor: 'divider', borderRadius: 1, px: 0.8, py: 0.6 }}>
                    <Typography sx={{ flex: 1, fontSize: '0.72rem', color: 'text.primary' }}>
                      {SPELL_LEVEL_LABELS[entry.level] || `Level ${entry.level}`} · expended {entry.expended}
                    </Typography>
                    <Button size="small" variant="outlined" onClick={() => adjustSlotRecoveryLevel(entry.level, -1)} sx={{ minWidth: 26, px: 0.7 }}>-</Button>
                    <Typography sx={{ minWidth: 16, textAlign: 'center', fontSize: '0.78rem', color: '#edd48a', fontFamily: '"Cinzel", Georgia, serif' }}>{value}</Typography>
                    <Button size="small" variant="outlined" onClick={() => adjustSlotRecoveryLevel(entry.level, 1)} disabled={slotRecoveryRemaining < entry.level || value >= entry.expended} sx={{ minWidth: 26, px: 0.7 }}>+</Button>
                  </Box>
                );
              })}
              <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                Remaining budget: {slotRecoveryRemaining}
              </Typography>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'rgba(35,32,26,1)', borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={() => setSlotRecovery(null)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={confirmSlotRecovery} disabled={!slotRecovery || slotRecoverySpent <= 0}>
            Recover
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function AdapterActionCard({ C, action, resources, onResChange, onRoll, onShowToast, resMax }) {
  const [open, setOpen] = useState(false);
  const hasRes = action.resKey && resources && resources[action.resKey] != null;
  const resCur = hasRes ? (resources[action.resKey] ?? 0) : 0;
  const safeMax = resMax === Infinity ? Infinity : Math.max(0, Number(resMax ?? 1) || 1);
  const ownerLevel = action.ownerLevel ?? C?.classLevel ?? C?.level ?? 1;
  const inlinePills = typeof action.inlinePills === 'function'
    ? action.inlinePills({ character: C, ownerLevel })
    : (Array.isArray(action.inlinePills) ? action.inlinePills : []);

  const rollFormulaButton = (kind) => {
    const formula = resolveFormula(kind === 'heal' ? action.healFormula : action.damageFormula, action, C);
    if (!formula || !onShowToast) return;
    const { total, rolls } = rollFormula(formula);
    const damageKind = String(action?.damageKind || '').toLowerCase();
    const fallbackVerb = kind === 'heal'
      ? 'Heal'
      : (damageKind === 'utility' ? 'Roll' : damageKind === 'heal' ? 'Heal' : 'Damage');
    const labelSource = kind === 'heal'
      ? (action.healButtonLabel ?? action.damageButtonLabel)
      : (action.damageButtonLabel ?? action.healButtonLabel);
    const label = resolveButtonLabel(labelSource, formula, action, C, `${fallbackVerb} ${formula}`);
    onShowToast(`${action.rollLabelPrefix || action.name} - ${label}`, formula, total, rolls);
  };
  const damageKind = String(action?.damageKind || '').toLowerCase();
  const damageVerb = damageKind === 'utility' ? 'Roll' : damageKind === 'heal' ? 'Heal' : 'Dmg';
  const damageButtonTone = damageKind === 'utility'
    ? { borderColor: 'rgba(77,149,214,0.4)', color: '#4d95d6' }
    : damageKind === 'heal'
      ? { borderColor: 'rgba(88,184,121,0.4)', color: '#58b879' }
      : { borderColor: 'rgba(255,107,53,0.4)', color: '#ff6b35' };
  const hasRollers = Number.isFinite(action.attackBonus) || action.damageFormula || action.healFormula;

  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Box onClick={() => setOpen(!open)} sx={{ ...spellRowSx, mb: 0, py: '7px' }}>
        {action.cat && CAT_COLORS[action.cat] && (
          <Box sx={{ width: 6, height: 28, borderRadius: 1, bgcolor: CAT_COLORS[action.cat], flexShrink: 0, opacity: 0.95 }} />
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'text.primary', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {action.name}
            </Typography>
            {hasRollers ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, flexWrap: 'wrap' }}>
                {Number.isFinite(action.attackBonus) ? (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => { e.stopPropagation(); onRoll?.(action.attackBonus, `${action.name} Attack`, action._disadvantage ? false : undefined); }}
                    sx={{ ...inlineButtonSx, borderColor: action._notProficient ? 'rgba(222,103,95,0.4)' : 'rgba(77,149,214,0.4)', color: action._notProficient ? '#de675f' : '#4d95d6' }}
                  >
                    <Sword size={12} style={{ marginRight: 2 }} /> Hit {fbonus(action.attackBonus)}{action._disadvantage ? ' DIS' : ''}
                  </Button>
                ) : null}
                {action.damageFormula ? (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => { e.stopPropagation(); rollFormulaButton('damage'); }}
                    sx={{ ...inlineButtonSx, ...damageButtonTone }}
                  >
                    {damageKind === 'utility'
                      ? <Dices size={12} style={{ marginRight: 2 }} />
                      : <Sword size={12} style={{ marginRight: 2 }} />}
                    {damageVerb} {resolveFormula(action.damageFormula, action, C)}
                  </Button>
                ) : null}
                {action.healFormula ? (
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={(e) => { e.stopPropagation(); rollFormulaButton('heal'); }}
                    sx={{ ...inlineButtonSx, borderColor: 'rgba(88,184,121,0.4)', color: '#58b879' }}
                  >
                    <Cross size={12} style={{ marginRight: 2 }} /> Heal {resolveFormula(action.healFormula, action, C)}
                  </Button>
                ) : null}
              </Box>
            ) : null}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', mt: 0.25 }}>
            {action._source ? (
              <Typography sx={{ fontSize: '0.55rem', color: 'text.secondary', fontStyle: 'italic', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{action._source}</Typography>
            ) : null}
            {action.uses ? (
              <Typography sx={{ fontSize: '0.55rem', color: 'text.secondary' }}>{action.uses}</Typography>
            ) : null}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, flexWrap: 'wrap', justifyContent: 'flex-end', flexShrink: 0 }}>
          {action.cat ? (
            <Chip
              size="small"
              label={action.cat}
              variant="outlined"
              sx={{ ...tinyMetaChipSx, color: CAT_COLORS[action.cat] || 'text.secondary', borderColor: CAT_COLORS[action.cat] || 'divider', bgcolor: `${CAT_COLORS[action.cat] || 'transparent'}14` }}
            />
          ) : null}
          {action.minLevel ? (
            <Chip size="small" label={`Lv${action.minLevel}`} variant="outlined" sx={{ ...tinyMetaChipSx, color: 'text.secondary' }} />
          ) : null}
          {action._weaponMastery ? (
            <Chip
              size="small"
              label={action._weaponMastery}
              variant="outlined"
              sx={{
                ...tinyMetaChipSx,
                color: '#edd48a',
                borderColor: 'rgba(237,212,138,0.55)',
                bgcolor: 'rgba(237,212,138,0.12)',
              }}
            />
          ) : null}
          {action._notProficient ? (
            <Chip size="small" label="NO PROF" variant="outlined" sx={{ ...tinyMetaChipSx, color: '#de675f', borderColor: '#de675f', bgcolor: 'rgba(222,103,95,0.14)' }} />
          ) : null}
          {action._disadvantage ? (
            <Chip size="small" label="DIS" variant="outlined" sx={{ ...tinyMetaChipSx, color: '#d69245', borderColor: '#d69245', bgcolor: 'rgba(213,138,61,0.14)' }} />
          ) : null}
          {inlinePills.map((pill, idx) => (
            <Chip
              key={`${pill.label || 'pill'}-${idx}`}
              size="small"
              variant="outlined"
              label={`${pill.label || ''}${pill.value != null ? ` ${pill.value}` : ''}`.trim()}
              sx={{ ...tinyMetaChipSx, color: '#edd48a', borderColor: 'rgba(237,212,138,0.4)', bgcolor: 'rgba(237,212,138,0.12)' }}
            />
          ))}
        </Box>
      </Box>

      {hasRes ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', px: '10px', py: '5px', border: 1, borderTop: 'none', borderColor: 'divider', borderRadius: '0 0 8px 8px', bgcolor: 'rgba(202,165,80,0.06)', mb: open ? 0 : '4px' }}>
          <Typography sx={{ fontSize: '0.55rem', color: 'text.secondary', fontFamily: '"Cinzel", Georgia, serif', mr: 0.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Uses</Typography>
          {safeMax === Infinity ? (
            <Typography sx={{ fontSize: '0.7rem', color: '#edd48a', fontFamily: '"Cinzel", Georgia, serif', fontWeight: 700 }}>∞</Typography>
          ) : (
            Array.from({ length: safeMax }, (_, i) => {
              const available = i < resCur;
              return (
                <Box
                  key={i}
                  title={available ? 'Available' : 'Used'}
                  onClick={(e) => { e.stopPropagation(); onResChange(action.resKey, available ? -1 : 1); }}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    border: '1.5px solid',
                    flexShrink: 0,
                    bgcolor: available ? 'transparent' : '#edd48a',
                    borderColor: available ? 'rgba(202,165,80,0.35)' : '#edd48a',
                    '&:hover': { borderColor: '#edd48a' },
                  }}
                />
              );
            })
          )}
        </Box>
      ) : null}

      {open ? (
        <Box sx={{ ...spellBodySx, mt: hasRes ? 0 : '-1px', mb: '4px' }}>
          {action.desc}
          {action._weaponMasteryText ? (
            <Box sx={{ mt: 0.7 }}>
              <Typography sx={{ fontSize: '0.66rem', color: '#edd48a', fontWeight: 700 }}>
                Weapon Mastery — {action._weaponMastery}
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                {action._weaponMasteryText}
              </Typography>
            </Box>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
}
