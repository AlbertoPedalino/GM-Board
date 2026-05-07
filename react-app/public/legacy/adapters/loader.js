/**
 * adapters/loader.js
 * Inietta ogni file del manifest come <script> sincrono via document.write.
 * Deve essere caricato durante il parsing iniziale della pagina (non dopo load).
 * Garantisce che tutti gli adapter siano registrati PRIMA che l'inline script esegua.
 */

(function () {
  if (typeof ADAPTER_MANIFEST === 'undefined') {
    console.error('[AdapterLoader] ADAPTER_MANIFEST non trovato – assicurati che manifest.js sia caricato prima di loader.js.');
    return;
  }
  ADAPTER_MANIFEST.forEach(function (path) {
    document.write('<script src="' + path + '"><\/script>');
  });
})();
