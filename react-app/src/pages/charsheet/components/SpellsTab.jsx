import { useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { SCHOOL_LABELS, SPELL_LEVEL_LABELS } from '../logic/calculations.js';

export default function SpellsTab({ C, sheet, resources, setResources }) {
  const snapshots = C?.spellSnapshots || [];
  const casterProgression = C?.clsSnapshot?.casterProgression;
  const slots = casterProgression ? getSlots(casterProgression, C.level) : {};
  const used = sheet?.spellSlotUsed || {};

  const byLevel = {};
  for (let i = 0; i <= 9; i++) byLevel[i] = [];
  snapshots.forEach(sp => {
    const lv = sp.level ?? 0;
    if (!byLevel[lv]) byLevel[lv] = [];
    byLevel[lv].push(sp);
  });

  const maxLevelWithSpells = Math.max(...Object.keys(byLevel).filter(k => byLevel[k].length > 0).map(Number), 0);

  return (
    <Box>
      {Array.from({ length: maxLevelWithSpells + 1 }, (_, lv) => (
        <Box key={lv} sx={{ mb: 1 }}>
          <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: '#4d95d6', textTransform: 'uppercase', borderBottom: 1, borderColor: 'rgba(77,149,214,0.14)', pb: 0.25, mb: 0.4 }}>
            {SPELL_LEVEL_LABELS[lv]}
            {lv > 0 && slots[lv] ? (
              <Box component="span" sx={{ ml: 1, fontSize: '0.56rem', color: 'text.secondary', fontWeight: 400 }}>
                ({used[lv] || 0}/{slots[lv]} slots)
              </Box>
            ) : null}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {byLevel[lv].map((sp, i) => (
              <SpellEntry key={i} spell={sp} />
            ))}
            {byLevel[lv].length === 0 && (
              <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontStyle: 'italic', py: 0.25 }}>None</Typography>
            )}
          </Box>
        </Box>
      ))}
      {snapshots.length === 0 && (
        <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontStyle: 'italic', py: 0.5 }}>No spells known.</Typography>
      )}
    </Box>
  );
}

function SpellEntry({ spell }) {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Box onClick={() => setOpen(!open)}
        sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.5, bgcolor: 'rgba(35,32,26,1)', border: 1, borderColor: 'divider', borderRadius: 1, fontSize: '0.8125rem', color: 'text.primary', cursor: 'pointer' }}>
        <Typography sx={{ flex: 1, minWidth: 0, fontSize: '0.8125rem' }}>{spell.name}</Typography>
        <Chip size="small" label={spell.concentration ? 'C' : ''}
          sx={{ fontSize: '0.5rem', height: 18, display: spell.concentration ? 'inline-flex' : 'none', color: '#9d7fb8', borderColor: '#9d7fb8', bgcolor: 'rgba(157,127,184,0.16)' }} />
        <Chip size="small" label={spell.ritual ? 'R' : ''}
          sx={{ fontSize: '0.5rem', height: 18, display: spell.ritual ? 'inline-flex' : 'none', color: '#58b879', borderColor: '#58b879', bgcolor: 'rgba(63,166,108,0.14)' }} />
        <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>{SCHOOL_LABELS[spell.school] || spell.school}</Typography>
      </Box>
      {open && (
        <Box sx={{ fontSize: '0.7rem', color: 'text.secondary', lineHeight: 1.5, bgcolor: '#12100e', border: 1, borderColor: 'divider', borderTop: 'none', borderRadius: '0 0 8px 8px', p: '6px 10px', mt: '-3px', mb: '3px' }}>
          {spell.range && <Box sx={{ mb: 0.25 }}><b>Range:</b> {spell.range}</Box>}
          {spell.duration && <Box sx={{ mb: 0.25 }}><b>Duration:</b> {spell.duration}</Box>}
          {spell.entries && <Box dangerouslySetInnerHTML={{ __html: renderEntries(spell.entries) }} />}
        </Box>
      )}
    </Box>
  );
}

function getSlots(progression, level) {
  if (!progression || !Array.isArray(progression)) return {};
  const row = progression[Math.min(level, progression.length) - 1];
  if (!row) return {};
  const slots = {};
  for (let i = 1; i <= 9; i++) {
    if (row[i] != null) slots[i] = row[i];
  }
  return slots;
}

function renderEntries(entries) {
  if (!entries) return '';
  if (typeof entries === 'string') return entries;
  if (Array.isArray(entries)) return entries.map(e => renderEntries(e)).join('<br/>');
  if (typeof entries === 'object') {
    if (entries.type === 'list') {
      return `<ul style="margin:0.3rem 0 0.3rem 1.2rem">${(entries.items || []).map(i => `<li>${renderEntries(i)}</li>`).join('')}</ul>`;
    }
    if (entries.name && entries.entries) {
      return `<b>${entries.name}.</b> ${renderEntries(entries.entries)}`;
    }
    if (entries.entries) return renderEntries(entries.entries);
  }
  return '';
}
