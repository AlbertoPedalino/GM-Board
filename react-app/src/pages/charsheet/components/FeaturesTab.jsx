import { useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { collectSheetEffects } from '../logic/sheetEffects.js';

export default function FeaturesTab({ C }) {
  const allFeatures = C?.allClassFeatures || [];
  const allSubFeatures = C?.allSubFeatures || [];
  const selectedFeats = C?.allFeatSnapshots || [];
  const speciesEntries = C?.speciesSnapshot?.entries || [];

  const baseFeatures = [
    { name: `Species: ${C?.speciesName || ''}`, level: 1, entries: speciesEntries, source: 'Species' },
    ...allFeatures.map(f => ({ ...f, source: C?.className || 'Class' })),
    ...allSubFeatures
      .filter(f => f.subclassShortName === C?.subclassShortName)
      .map(f => ({ ...f, source: `(${C?.subclassShortName})` })),
    ...selectedFeats.map(f => ({ name: f.name, level: null, entries: f.entries || [], source: 'Feat' })),
  ].filter(f => f.level == null || f.level <= (C?.level || 1));

  const baseKeys = new Set(baseFeatures.map(featureKey));

  const runtimePassiveNotes = collectSheetEffects(C || {})
    .filter(effect => String(effect?.type || '').toLowerCase() === 'passivenote')
    .map(passiveNoteToFeature)
    .filter(Boolean)
    .filter(f => !baseKeys.has(featureKey(f)))
    .filter(f => f.level == null || f.level <= (C?.level || 1));

  const features = [
    ...baseFeatures,
    ...runtimePassiveNotes,
  ];

  const groups = {};
  features.forEach(f => {
    const lv = f.level || 0;
    if (!groups[lv]) groups[lv] = [];
    groups[lv].push(f);
  });

  return (
    <Box>
      {Object.entries(groups).sort(([a], [b]) => Number(a) - Number(b)).map(([lv, feats]) => (
        <Box key={lv} sx={{ mb: 1 }}>
          <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4d95d6', borderBottom: 1, borderColor: 'rgba(77,149,214,0.14)', pb: 0.25, mb: 0.4 }}>
            {Number(lv) === 0 ? 'Species / Feats' : `Level ${lv}`}
          </Typography>
          {feats.map((f, i) => (
            <FeatureItem key={`${featureKey(f)}-${i}`} feature={f} />
          ))}
        </Box>
      ))}
    </Box>
  );
}


function featureKey(feature) {
  return `${normFeatureName(feature?.name)}|${Number(feature?.level || 0)}`;
}

function normFeatureName(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function passiveNoteToFeature(effect) {
  const note = cleanText(effect?.note);
  if (!note) return null;

  const [maybeTitle, ...rest] = note.split(':');
  const hasTitle = rest.length > 0 && maybeTitle.trim().length > 0 && maybeTitle.trim().length <= 80;

  return {
    name: hasTitle ? maybeTitle.trim() : 'Passive Note',
    level: Number(effect?.minLevel || 1),
    entries: hasTitle ? rest.join(':').trim() || note : note,
    source: effect?.ownerName ? `(${effect.ownerName})` : 'Runtime',
    runtimePassiveNote: true,
  };
}

function FeatureItem({ feature }) {
  const [open, setOpen] = useState(false);
  return (
    <Box className={open ? 'open' : ''} sx={{ bgcolor: 'rgba(35,32,26,1)', border: 1, borderColor: 'divider', borderRadius: 1, mb: 0.25, overflow: 'hidden' }}>
      <Box onClick={() => setOpen(!open)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: '9px', py: '6px', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(46,42,34,1)' } }}>
        <Typography sx={{ fontSize: '0.8125rem', color: 'text.primary', fontWeight: 600 }}>{feature.name}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {feature.source && <Typography sx={{ fontSize: '0.56rem', color: 'text.secondary', fontStyle: 'italic' }}>{feature.source}</Typography>}
          {feature.level && <Chip size="small" label={`Lv ${feature.level}`} variant="outlined" sx={{ fontSize: '0.44rem', height: 16, color: 'text.secondary' }} />}
        </Box>
      </Box>
      {open && feature.entries && (
        <Box sx={{ px: '12px', py: '8px', borderTop: 1, borderColor: 'divider', fontSize: '0.8125rem', color: 'text.secondary', lineHeight: 1.6 }}>
          {renderFeatureEntries(feature.entries)}
        </Box>
      )}
    </Box>
  );
}

function renderFeatureEntries(entries) {
  if (!entries) return '';
  if (typeof entries === 'string') return cleanText(entries);
  if (Array.isArray(entries)) return entries.map(e => renderFeatureEntries(e)).join('<br/>');
  if (typeof entries === 'object') {
    if (entries.type === 'list') {
      return `<ul style="margin:0.3rem 0 0.3rem 1.2rem">${(entries.items || []).map(i => `<li>${renderFeatureEntries(i)}</li>`).join('')}</ul>`;
    }
    if (entries.type === 'table') {
      let h = '<table style="width:100%;border-collapse:collapse;font-size:0.7rem;margin:0.4rem 0">';
      if (entries.colLabels) h += `<thead><tr>${entries.colLabels.map(l => `<th style="font-family:&quot;Cinzel&quot;,Georgia,serif;font-size:0.56rem;letter-spacing:0.08em;color:var(--text3);padding:3px 6px;border-bottom:1px solid var(--bdr)">${cleanText(l)}</th>`).join('')}</tr></thead>`;
      h += `<tbody>${(entries.rows || []).map(r => `<tr>${r.map(c => `<td style="padding:2px 6px;border-bottom:1px solid var(--bdr)">${renderFeatureEntries(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
      return h;
    }
    if (entries.name && entries.entries) {
      return `<b>${cleanText(entries.name)}.</b> ${renderFeatureEntries(entries.entries)}`;
    }
    if (entries.entries) return renderFeatureEntries(entries.entries);
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


