import { Box, Typography } from '@mui/material';
import { levelHeaderSx } from './spellsTabStyles.js';

export function StatBox({ value, label }) {
  return (
    <Box sx={{ minWidth: 80, bgcolor: 'rgba(35,32,26,1)', border: 1, borderColor: 'divider', borderRadius: 1, px: 1, py: 0.5, textAlign: 'center' }}>
      <Box sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '1rem', fontWeight: 700, color: '#edd48a' }}>{value}</Box>
      <Box sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.56rem', letterSpacing: '0.1em', color: 'text.secondary', textTransform: 'uppercase' }}>{label}</Box>
    </Box>
  );
}

export function Empty({ text }) {
  return <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontStyle: 'italic', py: 0.25 }}>{text}</Typography>;
}

export function SpellSection({ title, children }) {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography sx={levelHeaderSx}>{title}</Typography>
      {children}
    </Box>
  );
}

export function SlotPanel({ slots, used, onToggle }) {
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
