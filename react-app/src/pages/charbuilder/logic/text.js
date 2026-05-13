export function cleanText(value) {
  if (!value) return '';
  return String(value)
    .replace(/\{@hit ([^}]+)\}/g, (_, v) => `${Number(v) >= 0 ? '+' : ''}${v}`)
    .replace(/\{@damage ([^}]+)\}/g, '$1')
    .replace(/\{@d20 ([^}]+)\}/g, (_, v) => `${Number(v) >= 0 ? '+' : ''}${v}`)
    .replace(/\{@dc ([^}]+)\}/g, 'DC $1')
    .replace(/\{@h\}/g, 'Hit: ')
    .replace(/\{@atk ([^}]+)\}/g, '$1 Attack:')
    .replace(/\{@recharge ([^}]+)\}/g, '(Recharge $1-6)')
    .replace(/\{@chance ([^|}]+)[^}]*\}/g, '$1%')
    .replace(/\{@spell ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@item ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@creature ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@condition ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@skill ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@ability ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@action ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@i ([^}]+)\}/g, '$1')
    .replace(/\{@b ([^}]+)\}/g, '$1')
    .replace(/\{@italic ([^}]+)\}/g, '$1')
    .replace(/\{@bold ([^}]+)\}/g, '$1')
    .replace(/\{@filter ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@classFeature ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@subclassFeature ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@[a-z]+ ([^|}]+)[^}]*\}/gi, '$1')
    .replace(/\{[^}]+\}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function renderEntryText(entry) {
  if (!entry) return '';
  if (typeof entry === 'string' || typeof entry === 'number') return cleanText(entry);
  if (Array.isArray(entry)) return entry.map(renderEntryText).filter(Boolean).join('\n');
  if (typeof entry !== 'object') return '';
  if (entry.name && entry.entries) return `${cleanText(entry.name)}. ${renderEntryText(entry.entries)}`;
  if (entry.name && entry.entry) return `${cleanText(entry.name)} ${renderEntryText(entry.entry)}`;
  if (entry.entries) return renderEntryText(entry.entries);
  if (entry.entry) return renderEntryText(entry.entry);
  if (entry.items) return entry.items.map(renderEntryText).filter(Boolean).join('\n');
  if (entry.rows) return entry.rows.flat().map(renderEntryText).filter(Boolean).join(' ');
  return '';
}

export function normalizeName(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}
