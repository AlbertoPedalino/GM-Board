import { useMemo, useRef, useState } from 'react';

export default function LegacyFrame({ page, title, onLegacyNavigate }) {
  const frameRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const src = useMemo(() => {
    const search = window.location.search || '';
    return `/legacy/${page}${search}`;
  }, [page]);

  function handleLoad() {
    setLoading(false);

    const frame = frameRef.current;
    if (!frame?.contentWindow) return;

    try {
      const { pathname, search } = frame.contentWindow.location;
      onLegacyNavigate?.(pathname, search);
    } catch {
      // External pages are allowed to load in the frame; they cannot update React routing.
    }
  }

  return (
    <section className="legacy-pane" aria-label={title}>
      {loading && <div className="loading-strip">Caricamento</div>}
      <iframe
        key={src}
        ref={frameRef}
        className="legacy-frame"
        src={src}
        title={title}
        onLoad={handleLoad}
      />
    </section>
  );
}
