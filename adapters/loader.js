/**
 * adapters/loader.js
 * Carica tutti gli adapter via dynamic import del barrel.
 * Per pagine legacy che non usano React.
 * Dopo il caricamento, dispatches 'adapters-ready' e chiama window.__onAdaptersReady.
 */
(async function () {
  try {
    await import('./index.js');
    if (window.__gbAdapterManifestError) {
      console.error('[AdapterLoader]', window.__gbAdapterManifestError);
    }
  } catch (err) {
    console.error('[AdapterLoader] Import failed:', err);
  }
  document.dispatchEvent(new Event('adapters-ready'));
  if (typeof window.__onAdaptersReady === 'function') {
    window.__onAdaptersReady();
  }
})();
