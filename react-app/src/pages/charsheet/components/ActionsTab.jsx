import { useState } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { Swords, Shield, Zap, Eye, Crosshair } from 'lucide-react';
import { COMBAT_ACTIONS, getMod, getFinal, fbonus } from '../logic/calculations.js';

const FILTERS = ['all', 'attack', 'action', 'bonus', 'reaction'];

export default function ActionsTab({ C, sheet, onRoll }) {
  const [filter, setFilter] = useState('all');

  const inv = sheet?.sheetInventory || [];
  const attacks = inv.filter(i => i.equipped && ['M', 'R'].includes(i.type));

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.3, mb: '0.75rem' }}>
        {FILTERS.map(f => (
          <Chip key={f} size="small" label={f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            variant={filter === f ? 'filled' : 'outlined'} color={filter === f ? 'primary' : 'default'}
            onClick={() => setFilter(f)} sx={{ fontSize: '0.56rem', textTransform: 'uppercase', letterSpacing: '0.09em' }} />
        ))}
      </Box>

      {attacks.length > 0 && (
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

      <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'text.secondary', borderBottom: 1, borderColor: 'divider', pb: 0.25, mb: 0.25, mt: 1 }}>
        Combat Actions
      </Typography>
      {COMBAT_ACTIONS.map(action => (
        <ActionCard key={action.name} action={action} />
      ))}
    </Box>
  );
}

function ActionCard({ action }) {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ bgcolor: 'rgba(35,32,26,1)', border: 1, borderColor: 'divider', borderRadius: 1, mb: 0.25, overflow: 'hidden' }}>
      <Box onClick={() => setOpen(!open)}
        sx={{ display: 'flex', alignItems: 'center', gap: 1, px: '10px', py: '8px', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(46,42,34,1)' } }}>
        <Typography sx={{ flex: 1, fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary', overflow: 'hidden' }}>
          {action.name}
        </Typography>
      </Box>
      {open && (
        <Box sx={{ px: '10px', py: '6px 8px', borderTop: 1, borderColor: 'divider', fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.5 }}>
          {action.desc}
        </Box>
      )}
    </Box>
  );
}
