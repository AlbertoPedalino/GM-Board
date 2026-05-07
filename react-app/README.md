# GM Board React

Prima fase di migrazione React.

La app Vite monta le pagine HTML esistenti come pagine legacy isolate in `iframe`,
tranne la scheda personaggio: `character-sheet` e ora montata in una pagina React
dedicata che inserisce markup e script legacy nel DOM principale.

## Comandi

```bash
npm install
npm run dev
npm run build
```

Dev server predefinito: `http://127.0.0.1:5173/`.

## Struttura

- `src/App.jsx`: shell React e routing leggero.
- `src/legacy/LegacyFrame.jsx`: bridge per caricare una pagina HTML legacy.
- `src/pages/character-sheet/CharacterSheetPage.jsx`: bootstrap della scheda,
  ancora compatibile con CSS e runtime legacy.
- `src/pages/character-sheet/CharacterSheetLayout.jsx`: layout statico della scheda
  in JSX, diviso in sezioni grandi di pagina. Gli script legacy riempiono ancora i
  contenitori dinamici tramite gli stessi `id`; topbar, XP e riepilogo destro sono
  renderizzati da React usando snapshot letti dallo storage/runtime della scheda.
- `src/pages/character-sheet/characterSheetStorage.js`: scope `localStorage` e
  lettura/scrittura dei dati della scheda usati dai componenti React.
- `public/legacy/`: snapshot delle pagine HTML e degli adapter usati dagli script.

## Prossimo passo consigliato

Scegliere una pagina alla volta e sostituire il relativo `iframe` con componenti React
progressivi, lasciando le altre pagine nel bridge legacy finche non vengono migrate.
