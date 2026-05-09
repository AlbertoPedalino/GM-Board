import { useEffect, useState } from 'react';
import { Box, Chip, Typography, Button } from '@mui/material';
import { Sword, Cross } from 'lucide-react';
import { getMod, getFinal } from '../logic/calculations.js';
import { installedRegistry, loadCoreAdapters, loadClassAdapters } from '../../../adapters/index.js';
import { fbonus } from '../logic/calculations.js';
import { setStorageJson } from '../../../shared/storage.js';
import { PACT_SLOTS } from '../../charbuilder/constants.js';
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

export default function ActionsTab({ C, sheet, onRoll, resources, setResources, onShowToast, onUpdateSheet }) {
  const [filter, setFilter] = useState('all');
  const classNames = [C?.className, ...(C?.extraClasses || []).map((e) => e.name)].filter(Boolean);

  useEffect(() => {
    Promise.all([
      loadCoreAdapters(),
      loadClassAdapters(classNames, { getMod, getFinal }),
    ]);
  }, [classNames]);

  const inv = sheet?.sheetInventory || [];
  const attacks = inv.filter(i => i.equipped && ['M', 'R'].includes(String(i.type || '').toUpperCase()));
  const adapterActions = [...makeWeaponActions(C, attacks, inv), ...collectAdapterActions(C)].map((action) => resolveActionFormulas(action, C));
  const showAttacks = false;
  const actionSections = SECTION_DEFS
    .filter(section => filter === 'all' || filter === section.key)
    .map(section => ({
      ...section,
      actions: adapterActions.filter(action => section.cats.includes(action.cat)),
    }))
    .filter(section => section.actions.length > 0);

  const runtime = C?.adapterRuntime || {};
  const allResDefs = [...(runtime.classResources || []), ...(runtime.subclassResources || []), ...(runtime.speciesResources || []), ...(runtime.featResources || [])];
  const resMaxMap = {};
  allResDefs.forEach(def => { if (def.key) resMaxMap[def.key] = normalizeResourceMax(def, C); });

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
        const result = sideEffect({ character: C, C, sheet, resources: res, PACT_SLOTS });
        if (result?.type === 'recover_pact_slots' && result.recover > 0) {
          const level = Number(result.slotLevel || 1);
          const used = { ...(sheet?.spellSlotUsed || {}) };
          const before = Number(used[level] || 0);
          const after = Math.max(0, before - Number(result.recover || 0));
          used[level] = after;
          setStorageJson('5e_slots_used', used);
          onUpdateSheet?.({ spellSlotUsed: used });
          onShowToast?.('Magical Cunning', `Recovered ${before - after} Pact Magic slot${before - after === 1 ? '' : 's'}`, before - after, []);
        }
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.3, mb: '0.75rem' }}>
        {FILTERS.map(f => (
          <Chip key={f} size="small" label={f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            variant={filter === f ? 'filled' : 'outlined'} color={filter === f ? 'primary' : 'default'}
            onClick={() => setFilter(f)} sx={{ fontSize: '0.56rem', textTransform: 'uppercase', letterSpacing: '0.09em' }} />
        ))}
      </Box>

      {showAttacks && (
        <Box sx={{ overflow: 'auto', mb: 1 }}>
          <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'text.secondary', borderBottom: 1, borderColor: 'divider', pb: 0.25, mb: 0.25 }}>
            Attacks
          </Typography>
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
        <Box key={section.key} sx={{ mb: 1 }}>
          <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'primary.main', borderBottom: 1, borderColor: 'divider', pb: 0.25, mb: 0.25 }}>
            {section.title}
          </Typography>
          {section.actions.map((action, i) => (
            <AdapterActionCard key={`${section.key}-${i}`} C={C} action={action} resources={resources} onResChange={handleResChange} onRoll={onRoll} onShowToast={onShowToast} resMax={resMaxMap[action.resKey]} />
          ))}
        </Box>
      ))}
    </Box>
  );
}

function AdapterActionCard({ C, action, resources, onResChange, onRoll, onShowToast, resMax }) {
  const [open, setOpen] = useState(false);
  const hasRes = action.resKey && resources && resources[action.resKey] != null;
  const resCur = hasRes ? (resources[action.resKey] ?? 0) : 0;
  const ownerLevel = action.ownerLevel ?? C?.classLevel ?? C?.level ?? 1;
  const inlinePills = typeof action.inlinePills === 'function'
    ? action.inlinePills({ character: C, ownerLevel })
    : (Array.isArray(action.inlinePills) ? action.inlinePills : []);

  const rollFormulaButton = (kind) => {
    const formula = resolveFormula(kind === 'heal' ? action.healFormula : action.damageFormula, action, C);
    if (!formula || !onShowToast) return;
    const { total, rolls } = rollFormula(formula);
    const label = resolveButtonLabel(action.damageButtonLabel, formula, action, C, `${kind === 'heal' ? 'Heal' : 'Damage'} ${formula}`);
    onShowToast(`${action.rollLabelPrefix || action.name} - ${label}`, formula, total, rolls);
  };

  return (
    <Box sx={{ bgcolor: 'rgba(35,32,26,1)', border: 1, borderColor: 'divider', borderRadius: 1, mb: 0.25, overflow: 'hidden' }}>
      <Box onClick={() => setOpen(!open)}
        sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: '10px', py: '7px', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(46,42,34,1)' } }}>
        {action.cat && CAT_COLORS[action.cat] && (
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: CAT_COLORS[action.cat], flexShrink: 0 }} />
        )}
        <Typography sx={{ flex: 1, fontSize: '0.75rem', fontWeight: 600, color: 'text.primary', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {action.name}
        </Typography>
        {(Number.isFinite(action.attackBonus) || action.damageFormula || action.healFormula) ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, mr: '6px' }}>
            {Number.isFinite(action.attackBonus) ? (
              <Button size="small" variant="outlined"
                onClick={(e) => { e.stopPropagation(); onRoll?.(action.attackBonus, `${action.name} Attack`, action._disadvantage ? false : undefined); }}
                sx={{ fontSize: '0.6rem', minWidth: 0, py: 0.2, px: 0.8, lineHeight: 1.3, borderColor: action._notProficient ? 'rgba(222,103,95,0.4)' : 'rgba(77,149,214,0.4)', color: action._notProficient ? '#de675f' : '#4d95d6' }}>
                <Sword size={12} style={{ marginRight: 2 }} /> Hit {fbonus(action.attackBonus)}{action._disadvantage ? ' DIS' : ''}
              </Button>
            ) : null}
            {action.damageFormula ? (
              <Button size="small" variant="outlined"
                onClick={(e) => { e.stopPropagation(); rollFormulaButton('damage'); }}
                sx={{ fontSize: '0.6rem', minWidth: 0, py: 0.2, px: 0.8, lineHeight: 1.3, borderColor: 'rgba(255,107,53,0.4)', color: '#ff6b35' }}>
                <Sword size={12} style={{ marginRight: 2 }} /> Dmg {resolveFormula(action.damageFormula, action, C)}
              </Button>
            ) : null}
            {action.healFormula ? (
              <Button size="small" variant="outlined" color="success"
                onClick={(e) => { e.stopPropagation(); rollFormulaButton('heal'); }}
                sx={{ fontSize: '0.6rem', minWidth: 0, py: 0.2, px: 0.8, lineHeight: 1.3, borderColor: 'rgba(88,184,121,0.4)', color: '#58b879' }}>
                <Cross size={12} style={{ marginRight: 2 }} /> Heal {resolveFormula(action.healFormula, action, C)}
              </Button>
            ) : null}
          </Box>
        ) : null}
        {action.cat && (
          <Chip size="small" label={action.cat}
            sx={{ fontSize: '0.46rem', height: 16, textTransform: 'uppercase', letterSpacing: '0.06em', color: CAT_COLORS[action.cat] || 'text.secondary', borderColor: CAT_COLORS[action.cat] || 'divider', bgcolor: `${CAT_COLORS[action.cat] || 'transparent'}14` }} />
        )}
        {action.minLevel && (
          <Chip size="small" label={`Lv${action.minLevel}`} variant="outlined" sx={{ fontSize: '0.44rem', height: 16, color: 'text.secondary' }} />
        )}
        {action._notProficient && (
          <Chip size="small" label="NO PROF" sx={{ fontSize: '0.44rem', height: 16, color: '#de675f', borderColor: '#de675f', bgcolor: 'rgba(222,103,95,0.14)' }} />
        )}
        {action._disadvantage && (
          <Chip size="small" label="DIS (armor)" sx={{ fontSize: '0.44rem', height: 16, color: '#d69245', borderColor: '#d69245', bgcolor: 'rgba(213,138,61,0.14)' }} />
        )}
        {action._source && (
          <Typography sx={{ fontSize: '0.5rem', color: 'text.secondary', fontStyle: 'italic', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{action._source}</Typography>
        )}
        {inlinePills.map((pill, idx) => (
          <Chip key={`${pill.label || 'pill'}-${idx}`} size="small" label={`${pill.label || ''}${pill.value != null ? ` ${pill.value}` : ''}`.trim()}
            sx={{ fontSize: '0.46rem', height: 16, color: '#edd48a', borderColor: 'rgba(237,212,138,0.4)', bgcolor: 'rgba(237,212,138,0.12)' }} />
        ))}
        {action.uses && (
          <Typography sx={{ fontSize: '0.5rem', color: 'text.secondary', flexShrink: 0 }}>{action.uses}</Typography>
        )}
      </Box>
      {hasRes && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px', px: '10px', py: '4px', borderTop: '1px dashed', borderColor: 'divider', bgcolor: 'rgba(202,165,80,0.06)' }}>
          <Typography sx={{ fontSize: '0.55rem', color: 'text.secondary', fontFamily: '"Cinzel", Georgia, serif', mr: 0.5 }}>Uses:</Typography>
          {resMax === Infinity ? (
            <Typography sx={{ fontSize: '0.7rem', color: '#edd48a', fontFamily: '"Cinzel", Georgia, serif', fontWeight: 700 }}>∞</Typography>
          ) : (
            Array.from({ length: resMax }, (_, i) => {
              const available = i < resCur;
              return (
              <Box key={i} title={available ? 'Available' : 'Used'} onClick={(e) => { e.stopPropagation(); onResChange(action.resKey, available ? -1 : 1); }}
                sx={{ width: 10, height: 10, borderRadius: '50%', cursor: 'pointer', border: '1.5px solid', flexShrink: 0,
                  bgcolor: available ? 'transparent' : '#edd48a',
                  borderColor: available ? 'rgba(202,165,80,0.35)' : '#edd48a',
                  '&:hover': { borderColor: '#edd48a' } }} />
            );})
          )}
        </Box>
      )}

      {open && (
        <Box sx={{ px: '10px', py: '6px 8px', borderTop: 1, borderColor: 'divider', fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.5 }}>
          {action.desc}
        </Box>
      )}
    </Box>
  );
}
