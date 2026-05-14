import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Cross, Sword } from 'lucide-react';
import { SPELL_LEVEL_LABELS } from '../../charbuilder/constants.js';
import { SpellNameIcon } from '../../../shared/character/FiveEToolsLink.jsx';
import { SCHOOL_LABELS, fbonus, getFinal, getMod, getPB } from '../logic/calculations.js';
import {
  applySpellModifiers,
  computeScaledFormula,
  extractDamageDice,
  getCastBadge,
  getMetaLine,
  getResolvedCantripData,
  getSpellAbilityForEntry,
  getSpellStatusChips,
  getUpcastStep,
  renderEntries,
  resolveDmgBonusValue,
} from '../logic/spellsTabLogic.js';
import { inlineButtonSx, spellBodySx, spellRowSx } from './spellsTabStyles.js';
import { isConcentrationSpell, isRitualSpell } from '../../../shared/spellTags.js';

function applyFlatToFormula(formula, flat) {
  if (!formula) return formula;
  if (!flat) return formula;
  const text = String(formula).replace(/\s+/g, '');
  const match = text.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
  if (!match) return formula;
  const count = Number(match[1]);
  const faces = Number(match[2]);
  const total = Number(match[3] || 0) + Number(flat || 0);
  return `${count}d${faces}${total ? (total > 0 ? '+' : '') + total : ''}`;
}

function Badge({ label, color, bg = 'transparent' }) {
  return (
    <Box component="span" sx={{ border: 1, borderColor: color, color, bgcolor: bg, borderRadius: '3px', px: '6px', py: '1px', fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.56rem', lineHeight: 1.35, flexShrink: 0 }}>
      {label}
    </Box>
  );
}

export default function SpellEntry({ entry, onShowToast, atk: fallbackAtk, spellMod: fallbackSpellMod, C, installedRegistry }) {
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
  const hasConcentrationTag = isConcentrationSpell(entry) || isConcentrationSpell(spellData);
  const hasRitualTag = isRitualSpell(entry) || isRitualSpell(spellData);
  const ritualOnly = !!entry.ritualOnly || entry.sourceInfo?.kind === 'ritualBook';
  const hasHeal = !!spellData?.heal;
  const rawHealFormula = hasHeal ? (spellData?.baseDie || (rawDamages.length > 0 ? rawDamages[0].formula : null)) : null;
  const damages = hasHeal ? [] : rawDamages;
  const hasDamage = damages.length > 0;
  const steps = castLevel - baseLevel;

  const spellAbility = getSpellAbilityForEntry(C, entry);
  const spellMod = getMod(getFinal(C, spellAbility));
  const atk = getPB(C) + spellMod;


  const upcastStepDie = (steps > 0) ? (spellData?.upcastDie || getUpcastStep(entry.entriesHigherLevel)?.stepDie) : null;
  const baseScaledDamages = upcastStepDie
    ? damages.map(d => ({ ...d, formula: computeScaledFormula(d.formula, upcastStepDie, steps) }))
    : damages;

  const cantripData = baseLevel === 0 ? getResolvedCantripData(C, entry.name) : null;
  const characterLevel = Number(C?.level || C?.classLevel || 1);
  const beamCount = typeof cantripData?.beamCount === 'function'
    ? Math.max(1, Number(cantripData.beamCount(characterLevel) || 1))
    : 1;
  const beamBonus = resolveDmgBonusValue(C, cantripData?.dmgBonusPerBeam, getMod, getFinal);

  const expandedBeams = baseScaledDamages.flatMap((dmg, idx) => {
    const baseLabel = baseScaledDamages.length > 1 ? `Damage ${idx + 1}` : 'Damage';
    if (beamCount <= 1) return [{ ...dmg, label: baseLabel, formula: applyFlatToFormula(dmg.formula, beamBonus) || dmg.formula }];
    return Array.from({ length: beamCount }, (_, beamIdx) => ({
      ...dmg,
      label: `Beam ${beamIdx + 1}`,
      formula: applyFlatToFormula(dmg.formula, beamBonus) || dmg.formula,
    }));
  });

  const scaledDamages = expandedBeams.map((dmg) => ({
    ...dmg,
    formula: applySpellModifiers(C, {
      kind: 'damage',
      formula: dmg.formula,
      castLevel,
      level: baseLevel,
      spell: { ...entry, hasHeal: false, hasDamage: true, isCantrip: baseLevel === 0 },
      ownerClassName: entry.ownerClassName,
      ownerSubclassShortName: entry.ownerSubclassShortName,
      ownerLevel: entry.ownerLevel,
      hasHealContext: false,
      usesSpellSlot: baseLevel > 0 && !ritualOnly,
    }) || dmg.formula,
  }));
  const baseHealFormula = upcastStepDie && rawHealFormula
    ? computeScaledFormula(rawHealFormula, upcastStepDie, steps)
    : rawHealFormula;
  const healWithMod = baseHealFormula
    ? applyFlatToFormula(baseHealFormula, hasHeal ? spellMod : 0)
    : null;
  const healDisplayFormula = healWithMod
    ? applySpellModifiers(C, {
        kind: 'heal',
        formula: healWithMod,
        castLevel,
        level: baseLevel,
        spell: { ...entry, hasHeal: true, hasHealContext: true },
        ownerClassName: entry.ownerClassName,
        ownerSubclassShortName: entry.ownerSubclassShortName,
        ownerLevel: entry.ownerLevel,
        hasHealContext: true,
        usesSpellSlot: castLevel > 0 && !ritualOnly,
      }) || healWithMod
    : null;

  const levelLabel = castLevel > baseLevel ? ` (Lv.${castLevel})` : '';

  const rollAtk = (e) => {
    e.stopPropagation();
    const r = Math.floor(Math.random() * 20) + 1;
    const bonusText = atk >= 0 ? `+${atk}` : `${atk}`;
    onShowToast(`${entry.name} — Spell Attack${levelLabel}`, `d20 ${bonusText} = ${r + atk}`, r + atk, [{ v: r, faces: 20, kept: true }], { bonus: atk, kept: r });
  };

  const rollDmg = (e, formula, label) => {
    e.stopPropagation();
    const match = formula.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/);
    if (!match) { onShowToast(`${entry.name} — ${label}${levelLabel}`, formula, 0, []); return; }
    const n = parseInt(match[1]);
    const faces = parseInt(match[2]);
    const flat = match[3] ? parseInt(match[3]) : 0;
    let total = 0;
    const rolls = [];
    for (let i = 0; i < n; i++) { const v = Math.floor(Math.random() * faces) + 1; rolls.push({ v, faces }); total += v; }
    total += flat;
    onShowToast(`${entry.name} — ${label}${levelLabel}`, formula, total, rolls);
  };

  const rollHeal = (e, formula) => {
    e.stopPropagation();
    if (!formula) { onShowToast(`${entry.name} — Heal${levelLabel}`, '', 0, []); return; }
    const match = formula.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/);
    if (!match) { onShowToast(`${entry.name} — Heal${levelLabel}`, formula, 0, []); return; }
    const n = parseInt(match[1]);
    const faces = parseInt(match[2]);
    const flat = match[3] ? parseInt(match[3]) : 0;
    let total = 0;
    const rolls = [];
    for (let i = 0; i < n; i++) { const v = Math.floor(Math.random() * faces) + 1; rolls.push({ v, faces }); total += v; }
    total += flat;
    onShowToast(`${entry.name} — Heal${levelLabel}`, formula, total, rolls);
  };

  return (
    <Box>
      <Box onClick={() => setOpen(!open)}
        sx={{ ...spellRowSx, flexDirection: 'column', gap: '3px', alignItems: 'stretch' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0 }}>
          <SpellNameIcon spell={entry} />
          <Typography noWrap sx={{ overflow: 'hidden', minWidth: 0, fontSize: '0.875rem', color: 'text.primary', textOverflow: 'ellipsis' }}>{entry.name}</Typography>
          {castLevel > baseLevel ? <Badge label={`Lv.${castLevel}`} color="#d69245" bg="rgba(214,146,69,0.14)" /> : null}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', ml: 'auto', flexShrink: 0 }}>
            {(hasAttack || hasDamage || hasHeal) ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {hasAttack ? (
                  <Button size="small" variant="outlined"
                    onClick={rollAtk}
                    sx={{ ...inlineButtonSx, borderColor: 'rgba(77,149,214,0.4)', color: '#4d95d6' }}>
                    <Sword size={12} style={{ marginRight: 2 }} /> Hit {fbonus(atk)}
                  </Button>
                ) : null}
                {scaledDamages.map((dmg, i) => (
                  <Button key={i} size="small" variant="outlined"
                    onClick={(e) => rollDmg(e, dmg.formula, dmg.label || `Damage ${i + 1}`)}
                    sx={{ ...inlineButtonSx, borderColor: 'rgba(255,107,53,0.4)', color: '#ff6b35' }}>
                    <Sword size={12} style={{ marginRight: 2 }} /> {beamCount > 1 ? `Beam ${i + 1} ${dmg.formula}` : `Dmg ${dmg.formula}`}
                  </Button>
                ))}
                {hasHeal ? (
                  <Button size="small" variant="outlined"
                    onClick={(e) => rollHeal(e, healDisplayFormula)}
                    sx={{ ...inlineButtonSx, borderColor: 'rgba(88,184,121,0.4)', color: '#58b879' }}>
                    <Cross size={12} style={{ marginRight: 2 }} /> Heal {healDisplayFormula}
                  </Button>
                ) : null}
              </Box>
            ) : null}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px', flexWrap: 'wrap' }}>
            {entry.sourceInfo ? <Badge label={entry.sourceInfo.label} color={entry.sourceInfo.color || '#9d7fb8'} bg="rgba(157,127,184,0.16)" /> : null}
            {getSpellStatusChips(entry).map((chip) => <Badge key={chip.key} label={chip.label} color={chip.color} bg={chip.bg} />)}
            {ritualOnly ? <Badge label="Ritual only" color="#58b879" bg="rgba(63,166,108,0.14)" /> : null}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
            {school ? <Badge label={school} color="#c4b393" /> : null}
            {hasConcentrationTag ? <Badge label="C" color="#9d7fb8" bg="rgba(157,127,184,0.16)" /> : null}
            {hasRitualTag ? <Badge label="R" color="#58b879" bg="rgba(63,166,108,0.14)" /> : null}
            <Badge {...getCastBadge(entry)} />
          </Box>
        </Box>
      </Box>
      {(ritualOnly || beamCount > 1 || beamBonus) ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px', mt: '2px', mb: '2px', pl: '9px' }}>
          {beamCount > 1 ? <Badge label={`${beamCount} beams`} color="#9d7fb8" bg="rgba(157,127,184,0.16)" /> : null}
          {beamBonus ? <Badge label={`+${beamBonus} per beam`} color="#f5a623" bg="rgba(245,166,35,0.12)" /> : null}
        </Box>
      ) : null}
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
