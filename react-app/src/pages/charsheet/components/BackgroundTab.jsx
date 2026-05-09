import { Box, Typography } from '@mui/material';
import { renderEntries } from '../logic/renderEntries.js';

export default function BackgroundTab({ C }) {
  const bg = C?.bgSnapshot || {};
  const bgName = C?.bgName || '';
  const entries = bg.entries || [];

  return (
    <Box>
      <Box sx={{ mb: 1 }}>
        <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'primary.main', mb: 0.4 }}>
          {bgName || 'Background'}
        </Typography>
        {entries.length > 0 && (
          <Box sx={{ fontSize: '0.8125rem', color: 'text.secondary', lineHeight: 1.6 }}
            dangerouslySetInnerHTML={{ __html: renderEntries(entries) }} />
        )}
        {entries.length === 0 && (
          <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontStyle: 'italic' }}>
            No background details available.
          </Typography>
        )}
      </Box>

      {bg.skillProficiencies?.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'text.secondary', mb: 0.25 }}>
            Skill Proficiencies
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
            {bg.skillProficiencies.flatMap(sp => Object.keys(sp).filter(k => k !== 'choose')).join(', ')}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
