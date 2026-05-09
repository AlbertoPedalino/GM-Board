import { useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { X } from 'lucide-react';

export default function DiceToast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const d20Rolls = (toast.rolls || []).filter((r) => r.faces === 20);
  const keptD20 = d20Rolls.find((r) => r.kept) || d20Rolls[0];
  const isCrit = keptD20?.v >= 20;
  const isFail = keptD20?.v <= 1;
  const totalClass = isCrit ? '#edd48a' : isFail ? '#de675f' : 'text.primary';

  return (
    <Box sx={{
      position: 'fixed', bottom: '1.2rem', right: '1.2rem', zIndex: 999,
      bgcolor: 'rgba(26,23,19,0.97)', border: 2, borderColor: 'divider', borderRadius: 2,
      p: '1rem 1.2rem', minWidth: 240, maxWidth: 340,
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      backdropFilter: 'blur(8px)',
    }}>
      <IconButton size="small" onClick={onClose} sx={{ position: 'absolute', top: 6, right: 8, color: 'text.secondary' }}>
        <X size={14} />
      </IconButton>
      <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'text.secondary', mb: 0.3 }}>
        {toast.label}
      </Typography>
      {toast.rolls?.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.3, my: 0.4, alignItems: 'center' }}>
          {toast.rolls.map((r, i) => (
            <Box key={i} sx={{
              bgcolor: r.kept ? 'rgba(202,165,80,0.16)' : 'rgba(46,42,34,1)', border: 1, borderColor: r.kept ? 'primary.main' : 'divider', borderRadius: 1,
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.875rem', fontWeight: 700,
              color: r.v >= (r.faces || 20) ? '#edd48a' : r.v <= 1 ? '#de675f' : 'text.primary',
            }}>
              {r.v}
            </Box>
          ))}
        </Box>
      )}
      <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '1.5rem', fontWeight: 900, lineHeight: 1, textAlign: 'center', my: 0.3, color: totalClass }}>
        {toast.total > 0 ? toast.total : ''}
      </Typography>
      {toast.detail && (
        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', textAlign: 'center', mb: 0.4 }}>
          {toast.detail}
        </Typography>
      )}
      {Number.isFinite(toast.meta?.bonus) ? (
        <Typography sx={{ fontSize: '0.56rem', color: 'text.secondary', textAlign: 'center', fontFamily: '"Cinzel", Georgia, serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Modifier {toast.meta.bonus >= 0 ? `+${toast.meta.bonus}` : toast.meta.bonus}
        </Typography>
      ) : null}
    </Box>
  );
}
