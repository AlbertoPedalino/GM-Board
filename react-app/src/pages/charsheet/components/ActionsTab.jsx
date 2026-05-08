import { useEffect, useState } from 'react';
import { Box, Chip, Typography, Button } from '@mui/material';
import { Sword, Cross } from 'lucide-react';
import { getMod, getFinal, getPB, fbonus } from '../logic/calculations.js';
import { installedRegistry, loadCoreAdapters, loadClassAdapters } from '../../../adapters/index.js';
import { getWeaponProficiencyInfo, hasNonProficientArmor } from '../logic/proficiencies.js';

function resolveActionFormulas(action, C) {
  if (!action) return action;
  const ownerLv = action.ownerLevel ?? C?.classLevel ?? C?.level ?? 1;
  const ctx = { character: C, ownerLevel: ownerLv };
  const name = action.name;
  const allRaw = [];
  const classNames = [C?.className, ...(C?.extraClasses || []).map((e) => e.name)].filter(Boolean);
  classNames.forEach((cls) => {
    (installedRegistry.getClassSheetActions(cls) || []).forEach((a) => { if (a.name === name) allRaw.push(a); });
    (installedRegistry.getSubclassSheetActions(cls, C?.subclassShortName) || []).forEach((a) => { if (a.name === name) allRaw.push(a); });
  });
  (installedRegistry.getSpeciesSheetActions(C?.speciesName, C?.speciesSource) || []).forEach((a) => { if (a.name === name) allRaw.push(a); });
  const raw = allRaw[0];
  if (!raw) return action;
  const patch = {};
  if (typeof raw.healFormula === 'function') patch.healFormula = raw.healFormula(ctx);
  if (typeof raw.damageFormula === 'function') patch.damageFormula = raw.damageFormula(ctx);
  if (typeof raw.damageButtonLabel === 'function') patch.damageButtonLabel = raw.damageButtonLabel(ctx);
  return { ...action, ...patch };
}

const FILTERS = ['all', 'action', 'bonus', 'reaction'];
const CAT_COLORS = { attack: '#de675f', action: '#caa550', bonus: '#70b7a6', reaction: '#9d7fb8' };
const EXECUTABLE_CATS = new Set(['attack', 'action', 'bonus', 'reaction']);
const SECTION_DEFS = [
  { key: 'action', title: 'Actions', cats: ['action', 'attack'] },
  { key: 'bonus', title: 'Bonus Actions', cats: ['bonus'] },
  { key: 'reaction', title: 'Reactions', cats: ['reaction'] },
];

function normalizeResourceMax(def) {
  const raw = def?.maxComputed ?? def?.max ?? 1;
  const n = Number(raw);
  if (!Number.isFinite(n)) return raw === Infinity ? Infinity : 1;
  return Math.max(0, Math.floor(n));
}

function hasExplicitActionText(action) {
  const cat = String(action?.cat || '').toLowerCase();
  const desc = String(action?.desc || '').toLowerCase();
  if (cat === 'reaction') return /\breaction\b/.test(desc);
  if (cat === 'bonus') return /\bbonus action\b/.test(desc);
  if (cat === 'action') return /\b(action|magic action)\b/.test(desc);
  return false;
}

function isExecutableAction(action) {
  const cat = String(action?.cat || '').toLowerCase();
  const uses = String(action?.uses || '').trim().toLowerCase();
  const desc = String(action?.desc || '').trim().toLowerCase();
  if (!EXECUTABLE_CATS.has(cat)) return false;
  if (/^on\b/.test(uses) && !action?.resKey) return false;
  if ((uses === 'passive' || /^passive\s*\(/.test(uses) || /^passive:/.test(desc)) && !hasExplicitActionText(action)) {
    return false;
  }
  return true;
}

function collectAdapterActions(C) {
  const runtime = C?.adapterRuntime || {};
  const clsName = C?.className || '';
  const subName = C?.subclassShortName || '';
  const speciesName = C?.speciesName || '';
  const out = [];
  const pushFiltered = (arr, source) => {
    (arr || []).forEach(a => {
      if (!a || !a.name) return;
      const lv = Number(a.ownerLevel ?? C?.level ?? 1);
      if (a.minLevel && lv < Number(a.minLevel)) return;
      if (!isExecutableAction(a)) return;
      out.push({ ...a, _source: a.ownerName || source });
    });
  };
  pushFiltered(runtime.classActions, clsName);
  pushFiltered(runtime.subclassActions, `${subName} (${clsName})`);
  pushFiltered(runtime.speciesActions, speciesName);
  pushFiltered(runtime.featActions, 'Feat');
  return out;
}

function classLevel(C, className) {
  if (String(C?.className || '').toLowerCase() === String(className).toLowerCase()) return Number(C?.classLevel || C?.level || 1);
  const extra = (C?.extraClasses || []).find(ec => String(ec?.name || '').toLowerCase() === String(className).toLowerCase());
  return Number(extra?.level || 0);
}

function hasFeat(C, name) {
  return (C?.allFeatSnapshots || []).some(f => String(f?.name || '').toLowerCase() === String(name).toLowerCase());
}

function itemProps(item) {
  return [...(Array.isArray(item?.property) ? item.property : []), ...(Array.isArray(item?.properties) ? item.properties : [])]
    .map(p => String(p).toLowerCase());
}

function weaponAbility(C, item, weaponOverride) {
  if (weaponOverride?.ability) return weaponOverride.ability;
  const type = String(item?.type || '').toUpperCase();
  const overrides = installedRegistry.getWeaponAbilityOverrides();
  for (const o of overrides) {
    if (o.weaponTypes && !o.weaponTypes.includes(type)) continue;
    if (o.itemFlag && !(item?.flags || []).includes(o.itemFlag)) continue;
    if (typeof o.condition === 'function' && !o.condition(C)) continue;
    return o.ability;
  }
  const props = itemProps(item);
  const finesse = props.includes('f') || props.includes('fin') || props.includes('finesse');
  if (type === 'R') return 'dex';
  if (finesse) return getMod(getFinal(C, 'dex')) > getMod(getFinal(C, 'str')) ? 'dex' : 'str';
  return 'str';
}

function weaponDamageBase(item) {
  return item?.damage?.[0]?.damage || item?.dmg1 || item?.damageDice || item?.dmg || '';
}

function weaponDamageType(item) {
  return item?.damage?.[0]?.type || item?.dmgType || '';
}

function makeWeaponActions(C, attacks, inventory) {
  const overrides = installedRegistry.getWeaponAbilityOverrides();
  const weaponActions = attacks.map((item, index) => {
    const weaponOverride = overrides.find(o => {
      const type = String(item?.type || '').toUpperCase();
      if (o.weaponTypes && !o.weaponTypes.includes(type)) return false;
      if (o.itemFlag && !(item?.flags || []).includes(o.itemFlag)) return false;
      if (typeof o.condition === 'function' && !o.condition(C)) return false;
      return true;
    });
    const profInfo = getWeaponProficiencyInfo(C, item, weaponOverride);
    const ability = weaponAbility(C, item, weaponOverride);
    const mod = getMod(getFinal(C, ability));
    const base = weaponDamageBase(item);
    const damageFormula = base ? `${base}${mod >= 0 ? '+' : ''}${mod}` : '';
    const dtype = weaponDamageType(item);
    const untrainedArmor = hasNonProficientArmor(C, inventory);
    const disAdv = untrainedArmor && (ability === 'str' || ability === 'dex');
    return {
      name: item.name || 'Weapon',
      cat: 'attack',
      uses: 'Equipped',
      _source: 'Weapon',
      attackBonus: profInfo.proficient ? getPB(C) + mod : mod,
      damageFormula,
      damageButtonLabel: damageFormula ? `Damage ${damageFormula}${dtype ? ` ${dtype}` : ''}` : 'Damage',
      rollLabelPrefix: item.name || 'Weapon',
      desc: `${String(ability).toUpperCase()} weapon attack.${dtype ? ` Damage type: ${dtype}.` : ''}${profInfo.proficient ? '' : ' Not proficient.'}${disAdv ? ' DIS (armor).' : ''}`,
      _weaponIndex: index,
      _notProficient: !profInfo.proficient,
      _disadvantage: disAdv,
    };
  });
  const monkLevel = classLevel(C, 'Monk');
  const useDexUnarmed = monkLevel > 0 && getMod(getFinal(C, 'dex')) > getMod(getFinal(C, 'str'));
  const ability = useDexUnarmed ? 'dex' : 'str';
  const mod = getMod(getFinal(C, ability));
  const die = monkLevel >= 17 ? '1d12' : monkLevel >= 11 ? '1d10' : monkLevel >= 5 ? '1d8' : monkLevel >= 1 ? '1d6' : hasFeat(C, 'Tavern Brawler') ? '1d4' : '1';
  weaponActions.push({
    name: 'Unarmed Strike',
    cat: 'attack',
    uses: monkLevel ? 'Martial Arts' : 'Attack',
    _source: 'Basic',
    attackBonus: getPB(C) + mod,
    damageFormula: `${die}${mod >= 0 ? '+' : ''}${mod}`,
    damageButtonLabel: `Damage ${die}${mod >= 0 ? '+' : ''}${mod} bludgeoning`,
    rollLabelPrefix: 'Unarmed Strike',
    desc: `${String(ability).toUpperCase()} attack. Damage: ${die} + ${String(ability).toUpperCase()} modifier bludgeoning.`,
  });
  return weaponActions;
}

function resolveFormula(formula, action, C) {
  if (!formula) return '';
  if (typeof formula === 'function') return String(formula({ character: C, ownerLevel: action.ownerLevel ?? C?.classLevel ?? C?.level ?? 1 }) || '');
  return String(formula);
}

function resolveButtonLabel(label, formula, action, C, fallback) {
  if (typeof label === 'function') return label({ formula, character: C, ownerLevel: action.ownerLevel ?? C?.classLevel ?? C?.level ?? 1 });
  return label || fallback;
}

function rollFormula(formula) {
  const clean = String(formula || '').replace(/\s+/g, '');
  const diceRe = /([+-]?)(\d*)d(\d+)|([+-]?\d+)/gi;
  let total = 0;
  const rolls = [];
  let match;
  while ((match = diceRe.exec(clean))) {
    if (match[3]) {
      const sign = match[1] === '-' ? -1 : 1;
      const count = Number(match[2] || 1);
      const faces = Number(match[3]);
      for (let i = 0; i < count; i++) {
        const v = Math.floor(Math.random() * faces) + 1;
        rolls.push({ v, faces });
        total += sign * v;
      }
    } else if (match[4]) {
      total += Number(match[4]);
    }
  }
  return { total, rolls };
}

export default function ActionsTab({ C, sheet, onRoll, resources, setResources, onRest, onShowToast }) {
  const [filter, setFilter] = useState('all');
  const [ready, setReady] = useState(false);
  const classNames = [C?.className, ...(C?.extraClasses || []).map((e) => e.name)].filter(Boolean);

  useEffect(() => {
    Promise.all([
      loadCoreAdapters(),
      loadClassAdapters(classNames, { getMod, getFinal }),
    ]).then(() => setReady(true));
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
  allResDefs.forEach(def => { if (def.key) resMaxMap[def.key] = normalizeResourceMax(def); });

  const handleResChange = (key, delta) => {
    if (!resources || !setResources) return;
    const max = resMaxMap[key] ?? 1;
    const res = { ...resources };
    res[key] = Math.max(0, Math.min(max, (res[key] || 0) + delta));
    setResources(res);
    localStorage.setItem('5e_resources', JSON.stringify(res));
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

  const rollDmg = () => {
    if (!action.damageFormula || !onShowToast) return;
    const match = action.damageFormula.match(/(\d+)d(\d+)/);
    if (match) {
      const n = parseInt(match[1]);
      const faces = parseInt(match[2]);
      let total = 0;
      const rolls = [];
      for (let i = 0; i < n; i++) {
        const v = Math.floor(Math.random() * faces) + 1;
        rolls.push({ v, faces });
        total += v;
      }
      onShowToast(`${action.name} — ${action.damageButtonLabel || action.damageFormula}`, '', total, rolls);
    }
  };

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
                onClick={(e) => { e.stopPropagation(); onRoll?.(action.attackBonus, `${action.name} Attack`); }}
                sx={{ fontSize: '0.6rem', minWidth: 0, py: 0.2, px: 0.8, lineHeight: 1.3, borderColor: action._notProficient ? 'rgba(222,103,95,0.4)' : 'rgba(77,149,214,0.4)', color: action._notProficient ? '#de675f' : '#4d95d6' }}>
                <Sword size={12} style={{ marginRight: 2 }} /> {fbonus(action.attackBonus)}
              </Button>
            ) : null}
            {action.damageFormula ? (
              <Button size="small" variant="outlined"
                onClick={(e) => { e.stopPropagation(); rollFormulaButton('damage'); }}
                sx={{ fontSize: '0.6rem', minWidth: 0, py: 0.2, px: 0.8, lineHeight: 1.3, borderColor: 'rgba(255,107,53,0.4)', color: '#ff6b35' }}>
                <Sword size={12} style={{ marginRight: 2 }} /> {resolveFormula(action.damageFormula, action, C)}
              </Button>
            ) : null}
            {action.healFormula ? (
              <Button size="small" variant="outlined" color="success"
                onClick={(e) => { e.stopPropagation(); rollFormulaButton('heal'); }}
                sx={{ fontSize: '0.6rem', minWidth: 0, py: 0.2, px: 0.8, lineHeight: 1.3, borderColor: 'rgba(88,184,121,0.4)', color: '#58b879' }}>
                <Cross size={12} style={{ marginRight: 2 }} /> {resolveFormula(action.healFormula, action, C)}
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
