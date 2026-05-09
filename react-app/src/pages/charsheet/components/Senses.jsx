import { Box, Paper, Typography } from '@mui/material';
import { Eye } from 'lucide-react';
import { getSkillBonus } from '../logic/calculations.js';
import { installedRegistry } from '../../../adapters/index.js';

function collectEffectDefs(C) {
  const out = [];
  const push = (list, ownerLevel) => {
    (list || []).forEach((effect) => {
      if (!effect) return;
      if (effect.minLevel && Number(ownerLevel || 1) < Number(effect.minLevel)) return;
      if (typeof effect.condition === 'function') {
        try { if (!effect.condition(C)) return; } catch { return; }
      }
      out.push(effect);
    });
  };

  const primaryLevel = Number(C?.classLevel || C?.level || 1);
  push(installedRegistry.getClassSheetEffects(C?.className), primaryLevel);
  push(installedRegistry.getSubclassSheetEffects(C?.className, C?.subclassShortName), primaryLevel);
  (C?.extraClasses || []).forEach((extra) => {
    const level = Number(extra?.level || 1);
    push(installedRegistry.getClassSheetEffects(extra?.name), level);
    push(installedRegistry.getSubclassSheetEffects(extra?.name, extra?.subclassShortName), level);
  });
  push(installedRegistry.getSpeciesSheetEffects(C?.speciesName, C?.speciesSource), C?.level || 1);

  const runtime = C?.adapterRuntime || {};
  push(runtime.classEffects, primaryLevel);
  push(runtime.subclassEffects, primaryLevel);
  push(runtime.speciesEffects, C?.level || 1);

  return out;
}

export default function Senses({ C }) {
  const passPerc = 10 + getSkillBonus(C, { n: 'Perception', a: 'wis' });
  const passInv = 10 + getSkillBonus(C, { n: 'Investigation', a: 'int' });
  const passIns = 10 + getSkillBonus(C, { n: 'Insight', a: 'wis' });
  const effects = collectEffectDefs(C);
  const darkvisionEffects = effects.filter((e) => e.type === 'sense' && String(e.senseType || '').toLowerCase() === 'darkvision');
  const truesightEffects = effects.filter((e) => e.type === 'sense' && String(e.senseType || '').toLowerCase() === 'truesight');
  const dv = Math.max(Number(C?.speciesSnapshot?.darkvision || 0), ...darkvisionEffects.map((e) => Number(e.value || 0)));
  const truesight = Math.max(0, ...truesightEffects.map((e) => Number(e.value || 0)));
  const dvNote = darkvisionEffects.map((e) => e.note).filter(Boolean).join(' • ');
  const trueNote = truesightEffects.map((e) => e.note).filter(Boolean).join(' • ');

  return (
    <Paper variant="outlined" sx={{ mb: '0.6rem', overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'rgba(35,32,26,1)', borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1, px: '0.8rem', py: '0.48rem', borderLeft: 3, borderLeftColor: 'primary.main' }}>
        <Eye size={14} />
        <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'primary.main' }}>
          Senses
        </Typography>
      </Box>
      <Box sx={{ p: '0.55rem 0.8rem' }}>
        <SenseRow value={passPerc} label="Passive Perception" />
        <SenseRow value={passInv} label="Passive Investigation" />
        <SenseRow value={passIns} label="Passive Insight" />
        {dv > 0 && <SenseRow value={`${dv} ft`} label={dvNote ? `Darkvision — ${dvNote}` : 'Darkvision'} color="secondary.main" />}
        {truesight > 0 && <SenseRow value={`${truesight} ft`} label={trueNote ? `Truesight — ${trueNote}` : 'Truesight'} color="#edd48a" />}
      </Box>
    </Paper>
  );
}

function SenseRow({ value, label, color }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1, py: 0.25, bgcolor: 'rgba(35,32,26,1)', border: 1, borderColor: 'divider', borderRadius: 1, mb: 0.2, gap: 1 }}>
      <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '1.15rem', fontWeight: 700, color: color || '#edd48a', flexShrink: 0 }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', textAlign: 'right' }}>{label}</Typography>
    </Box>
  );
}
