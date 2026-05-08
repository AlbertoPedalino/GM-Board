function clean(s) {
  if (!s) return '';
  return String(s)
    .replace(/\{@hit ([^}]+)\}/g, (_, v) => `<b>${+v >= 0 ? '+' + v : v}</b>`)
    .replace(/\{@damage ([^}]+)\}/g, (_, v) => `<b>${v}</b>`)
    .replace(/\{@d20 ([^}]+)\}/g, (_, v) => `<b>${+v >= 0 ? '+' + v : v}</b>`)
    .replace(/\{@dc ([^}]+)\}/g, 'DC $1')
    .replace(/\{@h\}/g, '<i>Hit:</i> ')
    .replace(/\{@atk ([^}]+)\}/g, '<i>$1 Attack:</i>')
    .replace(/\{@recharge ([^}]+)\}/g, '(Recharge $1–6)')
    .replace(/\{@chance ([^|}]+)[^}]*\}/g, '$1%')
    .replace(/\{@spell ([^|}]+)[^}]*\}/g, '<i>$1</i>')
    .replace(/\{@item ([^|}]+)[^}]*\}/g, '<i>$1</i>')
    .replace(/\{@creature ([^|}]+)[^}]*\}/g, '<i>$1</i>')
    .replace(/\{@condition ([^|}]+)[^}]*\}/g, '<b>$1</b>')
    .replace(/\{@skill ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@ability ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@action ([^|}]+)[^}]*\}/g, '<b>$1</b>')
    .replace(/\{@i ([^}]+)\}/g, '<i>$1</i>')
    .replace(/\{@b ([^}]+)\}/g, '<b>$1</b>')
    .replace(/\{@italic ([^}]+)\}/g, '<i>$1</i>')
    .replace(/\{@bold ([^}]+)\}/g, '<b>$1</b>')
    .replace(/\{@filter ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@classFeature ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@subclassFeature ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@[a-z]+ ([^|}]+)[^}]*\}/gi, '$1')
    .replace(/\{[^}]+\}/g, '');
}

function rE(e) {
  if (!e) return '';
  if (typeof e === 'string') return clean(e);
  if (typeof e === 'number') return String(e);
  if (Array.isArray(e)) return e.map(rE).join('<br>');
  if (typeof e === 'object') {
    if (e.type === 'list') return `<ul>${(e.items || []).map(i => `<li>${rE(i)}</li>`).join('')}</ul>`;
    if (e.type === 'table') {
      let h = `<table>`;
      if (e.caption) h += `<caption style="font-weight:bold;margin-bottom:4px">${clean(e.caption)}</caption>`;
      if (e.colLabels) h += `<thead><tr>${e.colLabels.map(l => `<th>${clean(l)}</th>`).join('')}</tr></thead>`;
      h += `<tbody>${(e.rows || []).map(r => `<tr>${r.map(c => `<td>${rE(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
      return h;
    }
    if (e.type === 'entries' || e.type === 'section') return `<div style="margin-bottom:6px">${e.name ? `<b>${clean(e.name)}.</b> ` : ''}${rE(e.entries)}</div>`;
    if (e.type === 'inset' || e.type === 'insetReadaloud') return `<div style="border-left:2px solid rgba(199, 167, 99, .2);padding:6px 12px;margin:6px 0;font-style:italic">${rE(e.entries)}</div>`;
    if (e.name && e.entries) return `<div style="margin-bottom:6px"><b><i>${clean(e.name)}.</i></b> ${rE(e.entries)}</div>`;
    if (e.entries) return rE(e.entries);
    if (e.entry) return rE(e.entry);
  }
  return '';
}

export default function InfoCard({ item, tags, children }) {
  return (
    <div
      style={{
        background: 'var(--bg3, #23201a)',
        border: '1px solid var(--bdr, rgba(199, 167, 99, .2))',
        borderRadius: 'var(--r, 9px)',
        padding: '14px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
        <span style={{ color: 'var(--gold2, #edd48a)', fontFamily: 'var(--ff-display, Cinzel)', fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>
          {item.name}
        </span>
        {item.source && (
          <span style={{ color: 'var(--text3, #8f7a57)', fontSize: 12, fontStyle: 'italic', whiteSpace: 'nowrap', marginTop: 2 }}>
            {item.source}
          </span>
        )}
      </div>

      {tags && tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
          {tags.map((tag, i) => (
            <span
              key={i}
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '1px 6px',
                border: '1px solid',
                borderRadius: 3,
                color: tag.color || 'var(--text2, #c4b393)',
                borderColor: tag.color || 'var(--text3, #8f7a57)',
              }}
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {item.entries && (
        <div
          style={{ color: 'var(--text2, #c4b393)', fontSize: 13, lineHeight: 1.55 }}
          dangerouslySetInnerHTML={{ __html: rE(item.entries) }}
        />
      )}

      {children}
    </div>
  );
}
