import { Box, Paper, Typography, Tooltip } from '@mui/material';
import { Dice5, AlertCircle } from 'lucide-react';
import { STATS, SLBL, FULL_LBL, hasSaveProficiency, getSaveBonus, fbonus } from '../logic/calculations.js';
import { getEquippedArmorPenalties } from '../logic/armorPenalties.js';

export default function SavingThrows({ C, sheet, onRoll }) {
  const armorPenalties = getEquippedArmorPenalties(C, sheet?.sheetInventory || C?.inventory || []);
  
  return (
    <Paper variant="outlined" sx={{ mb: '0.6rem', overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'rgba(35,32,26,1)', borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1, px: '0.8rem', py: '0.48rem', borderLeft: 3, borderLeftColor: 'primary.main' }}>
        <Dice5 size={14} />
        <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'primary.main' }}>
          Saving Throws
        </Typography>
      </Box>
      <Box sx={{ p: '0.55rem 0.8rem' }}>
        {STATS.map(st => {
          const bonus = getSaveBonus(C, st);
          const prof = hasSaveProficiency(C, st);
          const hasDisadv = armorPenalties.hasPenalty && armorPenalties.disadvantageOn.includes(`${st}-saves`);
          const tooltipText = hasDisadv ? 'Disadvantage from armor' : '';
          
          return (
            <Box key={st} onClick={() => onRoll(st, { disadvantage: hasDisadv })}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, py: '3px', cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: 'rgba(202,165,80,0.04)' } }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, transition: 'all 0.1s', border: 1, borderColor: 'divider', bgcolor: prof ? 'primary.main' : 'transparent' }} />
              <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.625rem', fontWeight: 600, color: 'text.secondary', letterSpacing: '0.08em', width: 28, flexShrink: 0 }}>
                {SLBL[st]}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                {FULL_LBL[st]}
              </Typography>
              <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.75rem', fontWeight: 600, color: 'text.primary', ml: 'auto' }}>
                {fbonus(bonus)}
              </Typography>
              {hasDisadv && (
                <Tooltip title={tooltipText}>
                  <AlertCircle size={12} style={{ color: '#ff9800', flexShrink: 0 }} />
                </Tooltip>
              )}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
