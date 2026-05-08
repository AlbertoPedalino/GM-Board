import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Cross, Dices, Flame } from 'lucide-react';
import { SPELL_LEVEL_LABELS } from '../../charbuilder/constants.js';
import { SCHOOL_LABELS } from '../logic/calculations.js';
import {
  computeScaledFormula,
  extractDamageDice,
  getCastBadge,
  getMetaLine,
  getUpcastStep,
  renderEntries,
} from '../logic/spellsTabLogic.js';
import { spellBodySx, spellRowSx } from './spellsTabStyles.js';

function Badge({ label, color, bg = 'transparent' }) {
  return (
    <Box component="span" sx={{ border: 1, borderColor: color, color, bgcolor: bg, borderRadius: '3px', px: '6px', py: '1px', fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.56rem', lineHeight: 1.35, flexShrink: 0 }}>
      {label}
    </Box>
  );
}

export default function SpellEntry({ entry, onShowToast, atk, spellMod, C, installedRegistry }) {
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
