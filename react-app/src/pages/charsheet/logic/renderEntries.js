function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function cleanTags(text) {
  return escapeHtml(text)
    .replace(/\{@spell ([^|}]+)[^}]*\}/g, '<i>$1</i>')
    .replace(/\{@item ([^|}]+)[^}]*\}/g, '<i>$1</i>')
    .replace(/\{@dice ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@damage ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@hit ([^|}]+)[^}]*\}/g, '+$1')
    .replace(/\{@condition ([^|}]+)[^}]*\}/g, '<i>$1</i>')
    .replace(/\{@creature ([^|}]+)[^}]*\}/g, '<i>$1</i>')
    .replace(/\{@sense ([^|}]+)[^}]*\}/g, '<i>$1</i>')
    .replace(/\{@action ([^|}]+)[^}]*\}/g, '<b>$1</b>')
    .replace(/\{@skill ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@ability ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@dc ([^|}]+)[^}]*\}/g, 'DC $1')
    .replace(/\{@atk ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@b ([^}]+)\}/g, '<b>$1</b>')
    .replace(/\{@i ([^}]+)\}/g, '<i>$1</i>')
    .replace(/\{@scaled(?:amage|ice)\s+(\d+d\d+)\|[^}]+\}/g, '$1 per level')
    .replace(/\{@[a-z]+ ([^|}]+)[^}]*\}/gi, '$1')
    .replace(/\{@[^}]+\}/g, '')
    .replace(/\{[^}]+\}/g, '');
}

export function renderEntries(entries) {
  if (!entries) return '';
  if (typeof entries === 'string') return cleanTags(entries);
  if (Array.isArray(entries)) return entries.map((entry) => renderEntries(entry)).join('<br/>');
  if (typeof entries === 'object') {
    if (entries.type === 'list') {
      return `<ul style="margin:0.3rem 0 0.3rem 1.2rem">${(entries.items || []).map((item) => `<li>${renderEntries(item)}</li>`).join('')}</ul>`;
    }
    if (entries.name && entries.entries) return `<b>${cleanTags(entries.name)}.</b> ${renderEntries(entries.entries)}`;
    if (entries.entries) return renderEntries(entries.entries);
  }
  return '';
}
