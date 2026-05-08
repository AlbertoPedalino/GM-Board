import { Box, Typography, IconButton, TextField } from '@mui/material';
import { HeartPulse, Plus, Minus, Sparkles } from 'lucide-react';

export default function HPBlock({ sheet, onHeal, onDamage, onTempHP, onMaxHPBonus, onSetHP, onDeathSave }) {
  if (!sheet) return null;
  const dsSuccess = Math.max(0, Math.min(3, sheet.deathSaves.success || 0));
  const dsFail = Math.max(0, Math.min(3, sheet.deathSaves.fail || 0));
  const atZero = sheet.currentHP === 0;

  return (
    <Box sx={{ flex: '0 1 260px', minWidth: 220, maxWidth: 300, bgcolor: 'rgba(35,32,26,1)', border: 1, borderColor: 'divider', borderRadius: 1, p: '0.3rem 0.45rem' }}>
      <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'text.secondary' }}>
        HP
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        <IconButton size="small" onClick={onHeal} sx={{ width: 24, height: 24, border: 1, borderColor: '#58b879', color: '#58b879', borderRadius: 1 }}>
          <Plus size={12} />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', flex: 1, justifyContent: 'center', whiteSpace: 'nowrap' }}>
          <Typography
            component="span"
            sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: sheet.currentHP > sheet.maxHP / 2 ? '#58b879' : sheet.currentHP > 0 ? '#d69245' : '#c54a3f', lineHeight: 1 }}>
            {sheet.currentHP}
          </Typography>
          <Typography component="span" sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.875rem', color: 'text.secondary' }}>/</Typography>
          <Typography component="span" sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.875rem', fontWeight: 600, color: 'text.secondary' }}>
            {sheet.maxHP}
          </Typography>
        </Box>
        <TextField
          size="small" type="number" defaultValue={1}
          onChange={e => { const v = parseInt(e.target.value); if (v > 0) window._hpAmt = v; }}
          InputProps={{ inputProps: { min: 1, style: { textAlign: 'center' } } }}
          sx={{ width: 34, '& input': { py: 0.25, fontSize: '0.625rem', fontFamily: '"Cinzel", Georgia, serif', fontWeight: 600 } }}
        />
        <IconButton size="small" onClick={onDamage} sx={{ width: 24, height: 24, border: 1, borderColor: '#de675f', color: '#de675f', borderRadius: 1 }}>
          <Minus size={12} />
        </IconButton>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: '6px', alignItems: 'center', mt: 0.25 }}>
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper', color: 'text.secondary', fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.56rem', display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 0.5, py: 0.15, whiteSpace: 'nowrap' }}>
          <Sparkles size={10} /> TEMP <Box component="b" sx={{ color: '#edd48a', fontWeight: 700, ml: 'auto' }}>{sheet.tempHP}</Box>
        </Box>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
          <IconButton size="small" onClick={() => onTempHP(-1)} sx={{ width: 18, height: 18, border: 1, borderColor: 'divider', borderRadius: '4px', color: 'text.secondary' }}>-</IconButton>
          <IconButton size="small" onClick={() => onTempHP(1)} sx={{ width: 18, height: 18, border: 1, borderColor: 'divider', borderRadius: '4px', color: 'text.secondary' }}>+</IconButton>
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: '6px', alignItems: 'center', mt: 0.25 }}>
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper', color: 'text.secondary', fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.56rem', display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 0.5, py: 0.15, whiteSpace: 'nowrap' }}>
          <HeartPulse size={10} /> MAX MOD <Box component="b" sx={{ color: '#edd48a', fontWeight: 700, ml: 'auto' }}>{sheet.maxHPBonus > 0 ? '+' : ''}{sheet.maxHPBonus}</Box>
        </Box>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
          <IconButton size="small" onClick={() => onMaxHPBonus(-1)} sx={{ width: 18, height: 18, border: 1, borderColor: 'divider', borderRadius: '4px', color: 'text.secondary' }}>-</IconButton>
          <IconButton size="small" onClick={() => onMaxHPBonus(1)} sx={{ width: 18, height: 18, border: 1, borderColor: 'divider', borderRadius: '4px', color: 'text.secondary' }}>+</IconButton>
        </Box>
      </Box>
      {atZero && (
        <Box sx={{ mt: 0.25, pt: 0.25, borderTop: '1px dashed', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
          <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.56rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'text.secondary' }}>
            Death Saves
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
            {Array.from({ length: 3 }, (_, i) => (
              <Box key={`s${i}`} sx={{ width: 12, height: 12, borderRadius: '50%', border: 1, borderColor: 'divider', bgcolor: i < dsSuccess ? '#58b879' : 'transparent' }} />
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
            {Array.from({ length: 3 }, (_, i) => (
              <Box key={`f${i}`} sx={{ width: 12, height: 12, borderRadius: '50%', border: 1, borderColor: 'divider', bgcolor: i < dsFail ? '#de675f' : 'transparent' }} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
