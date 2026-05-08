import { Box, Typography } from '@mui/material';

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

function renderEntries(entries) {
  if (!entries) return '';
  if (typeof entries === 'string') return cleanText(entries);
  if (Array.isArray(entries)) return entries.map(e => renderEntries(e)).join('<br/>');
  if (typeof entries === 'object') {
    if (entries.type === 'list') {
      return `<ul style="margin:0.3rem 0 0.3rem 1.2rem">${(entries.items || []).map(i => `<li>${renderEntries(i)}</li>`).join('')}</ul>`;
    }
    if (entries.name && entries.entries) {
      return `<b>${cleanText(entries.name)}.</b> ${renderEntries(entries.entries)}`;
    }
    if (entries.entries) return renderEntries(entries.entries);
  }
  return '';
}

function cleanText(s) {
  if (!s) return '';
  return String(s)
    .replace(/\{@hit ([^}]+)\}/g, '<b>$1</b>')
    .replace(/\{@damage ([^}]+)\}/g, '<b>$1</b>')
    .replace(/\{@dc ([^}]+)\}/g, 'CD $1')
    .replace(/\{@spell ([^|}]+)[^}]*\}/g, '<i>$1</i>')
    .replace(/\{@condition ([^|}]+)[^}]*\}/g, '<b>$1</b>')
    .replace(/\{@action ([^|}]+)[^}]*\}/g, '<b>$1</b>')
    .replace(/\{@skill ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@ability ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@b ([^}]+)\}/g, '<b>$1</b>')
    .replace(/\{@i ([^}]+)\}/g, '<i>$1</i>')
    .replace(/\{@[a-z]+ ([^|}]+)[^}]*\}/gi, '$1')
    .replace(/\{[^}]+\}/g, '');
}
