import { Box, Paper, Typography } from '@mui/material';
import { ScrollText } from 'lucide-react';

function collectProfs(C) {
  const sp = C.clsSnapshot?.startingProficiencies || {};
  const armorSet = new Set();
  const weaponSet = new Set();
  const toolSet = new Set();
  const langSet = new Set();

  const normalize = (v) => {
    if (!v) return '';
    return String(v).replace(/\{@[a-z]+ ([^|}]+)(?:\|[^}]*)?\}/gi, '$1').replace(/[{}]/g, '').replace(/\.$/, '').trim();
  };
  const addFixed = (src, set) => {
    (Array.isArray(src) ? src : [src]).forEach(entry => {
      if (!entry) return;
      if (typeof entry === 'string') { entry.split(/[;,]/).map(normalize).filter(Boolean).forEach(v => set.add(v)); return; }
      Object.keys(entry).filter(k => !['choose', 'any'].includes(k) && entry[k] !== false).map(normalize).filter(Boolean).forEach(v => set.add(v));
    });
  };
  addFixed(sp.armor, armorSet);
  addFixed(sp.weapons, weaponSet);
  addFixed(sp.tools, toolSet);
  const bg = C.bgSnapshot || {};
  if (bg.toolProficiencies) addFixed(bg.toolProficiencies, toolSet);
  if (bg.languageProficiencies) addFixed(bg.languageProficiencies, langSet);
  if (C?.choices) {
    for (const [key, val] of Object.entries(C.choices)) {
      if (!val) continue;
      const lk = key.toLowerCase();
      const vals = Array.isArray(val) ? val : [val];
      if (lk.includes('tool')) vals.forEach(v => { const n = normalize(v); if (n) toolSet.add(n); });
      if (lk.includes('language')) vals.forEach(v => { const n = normalize(v); if (n) langSet.add(n); });
      if (lk.includes('weapon') || lk.includes('mastery')) vals.forEach(v => { const n = normalize(v); if (n) weaponSet.add(n); });
    }
  }

  const sections = [];
  if (armorSet.size) sections.push({ title: 'Armor', items: Array.from(armorSet) });
  if (weaponSet.size) sections.push({ title: 'Weapons', items: Array.from(weaponSet) });
  if (toolSet.size) sections.push({ title: 'Tools', items: Array.from(toolSet) });
  if (langSet.size) sections.push({ title: 'Languages', items: Array.from(langSet) });
  return sections;
}

export default function Proficiencies({ C }) {
  const sections = collectProfs(C);
  return (
    <Paper variant="outlined" sx={{ mb: '0.6rem', overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'rgba(35,32,26,1)', borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1, px: '0.8rem', py: '0.48rem', borderLeft: 3, borderLeftColor: 'primary.main' }}>
        <ScrollText size={14} />
        <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'primary.main' }}>
          Proficiencies
        </Typography>
      </Box>
      <Box sx={{ p: '0.55rem 0.8rem' }}>
        {sections.length === 0 && (
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontStyle: 'italic' }}>No proficiencies loaded.</Typography>
        )}
        {sections.map(sec => (
          <Box key={sec.title} sx={{ mb: '0.7rem' }}>
            <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'text.secondary', mb: 0.25 }}>
              {sec.title}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.5 }}>
              {sec.items.join(', ')}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
