import { useEffect, useMemo, useRef, useState } from 'react';

const REACT_ROUTE_MESSAGE = 'gm-board-react:navigate';

export default function LegacyFrame({ page, title, onLegacyNavigate, onLegacyRouteRequest }) {
  const frameRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const src = useMemo(() => {
    const search = window.location.search || '';
    return `/legacy/${page}${search}`;
  }, [page]);

  useEffect(() => {
    function handleMessage(event) {
      const frame = frameRef.current;
      if (!frame?.contentWindow || event.source !== frame.contentWindow) return;
      if (event.data?.type !== REACT_ROUTE_MESSAGE) return;

      onLegacyRouteRequest?.(event.data.path, event.data.search || '');
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onLegacyRouteRequest]);

  function installReactNavigationBridge(frame) {
    try {
      const win = frame.contentWindow;
      if (!win || win.__gbReactNavigationBridgeInstalled) return;

      const previousScopedHref = win.gbScopedHref;
      win.gbScopedHref = function gbReactScopedHref(pageName) {
        if (String(pageName || '') === 'character-sheet.html') {
          return `javascript:parent.postMessage({type:'${REACT_ROUTE_MESSAGE}',path:'/character-sheet',search:location.search},'*')`;
        }

        return typeof previousScopedHref === 'function'
          ? previousScopedHref(pageName)
          : pageName;
      };

      win.__gbReactNavigationBridgeInstalled = true;
    } catch {
      // Cross-origin legacy pages cannot be patched; the onLoad fallback still handles local pages.
    }
  }

  function handleLoad() {
    setLoading(false);

    const frame = frameRef.current;
    if (!frame?.contentWindow) return;

    try {
      installReactNavigationBridge(frame);

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
