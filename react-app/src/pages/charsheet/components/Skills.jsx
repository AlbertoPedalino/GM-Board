import { Box, Paper, Typography } from '@mui/material';
import { SKILLS, getSkillProficiency, getSkillBonus, fbonus, SLBL } from '../logic/calculations.js';

export default function Skills({ C, onRoll }) {
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'rgba(35,32,26,1)', borderBottom: 1, borderColor: 'divider', px: '0.8rem', py: '0.48rem', borderLeft: 3, borderLeftColor: 'primary.main' }}>
        <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'primary.main' }}>
          Skills
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '20px 30px 1fr auto', gap: '4px', px: '0.9rem', pt: '0.3rem', pb: '0.3rem', fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'text.secondary' }}>
        <span></span>
        <span>Prof.</span>
        <span>Skill</span>
        <span>Mod.</span>
      </Box>
      {SKILLS.map(sk => {
        const prof = getSkillProficiency(C, sk.n);
        const bonus = getSkillBonus(C, sk);
        const dotColor = prof === 'exp' ? 'secondary.main' : prof === 'prof' ? 'primary.main' : 'divider';
        const dotStyle = prof === 'prof' ? {} : prof === 'exp' ? {} : {};
        return (
          <Box key={sk.n} onClick={() => onRoll(sk.n, bonus)}
            sx={{ display: 'grid', gridTemplateColumns: '20px 30px 1fr auto', gap: '4px', px: '0.9rem', py: '3px', alignItems: 'center', cursor: 'pointer', transition: 'background 0.1s', '&:hover': { bgcolor: 'rgba(202,165,80,0.05)' } }}>
            <Box />
            <Box sx={{ width: 9, height: 9, borderRadius: '50%', border: 1, borderColor: dotColor, bgcolor: prof ? dotColor : 'transparent' }} />
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              {sk.n}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.5rem', color: 'text.secondary', letterSpacing: '0.06em' }}>
                {SLBL[sk.a]}
              </Typography>
              <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.75rem', fontWeight: 600, color: 'text.primary', textAlign: 'right' }}>
                {fbonus(bonus)}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Paper>
  );
}
