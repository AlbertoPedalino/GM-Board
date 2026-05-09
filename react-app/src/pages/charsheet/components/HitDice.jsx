import { Box, Paper, Typography } from '@mui/material';
import { Dice5 } from 'lucide-react';
import { getHitDicePools, getUsedHitDiceTotal } from '../logic/restResources.js';

export default function HitDice({ C, sheet }) {
  const pools = getHitDicePools(C, sheet.usedHDPools, sheet.usedHD);
  const totalHD = pools.reduce((sum, pool) => sum + pool.total, 0);
  const usedHD = getUsedHitDiceTotal(Object.fromEntries(pools.map((pool) => [pool.key, pool.used])));
  const remaining = Math.max(0, totalHD - usedHD);

  return (
    <Paper variant="outlined" sx={{ mb: '0.6rem', overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'rgba(35,32,26,1)', borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1, px: '0.8rem', py: '0.48rem', borderLeft: 3, borderLeftColor: 'primary.main' }}>
        <Dice5 size={14} />
        <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'primary.main' }}>
          Hit Dice
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', ml: 'auto' }}>
          {pools.map((pool) => `${pool.label} d${pool.faces}`).join(' / ')}
        </Typography>
      </Box>
      <Box sx={{ p: '0.55rem 0.8rem' }}>
        <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
          Remaining: {remaining} / {totalHD}
        </Typography>
        {pools.map((pool) => (
          <Box key={pool.key} sx={{ mb: 0.45 }}>
            <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary', mb: 0.25 }}>
              {pool.label}: {pool.remaining}/{pool.total} d{pool.faces}
            </Typography>
            <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {Array.from({ length: pool.total }, (_, i) => (
                <Box key={i} sx={{
                  width: 18, height: 18, borderRadius: '3px', border: 1, borderColor: 'divider',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.625rem', color: i < pool.remaining ? 'primary.main' : 'text.disabled',
                  bgcolor: i < pool.remaining ? 'rgba(202,165,80,0.14)' : 'rgba(35,32,26,1)',
                  opacity: i < pool.remaining ? 1 : 0.3,
                }}>
                  {i < pool.remaining ? '●' : '○'}
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
