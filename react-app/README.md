# GM Board React

Prima fase di migrazione React.

La app Vite monta le pagine HTML esistenti come pagine legacy isolate in `iframe`.
Questo conserva gli script globali e permette di verificare subito che il comportamento
rimanga equivalente, prima di estrarre componenti React veri e propri.

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
- `public/legacy/`: snapshot delle pagine HTML e degli adapter usati dagli script.

## Prossimo passo consigliato

Scegliere una pagina alla volta e sostituire il relativo `iframe` con componenti React
progressivi, lasciando le altre pagine nel bridge legacy finche non vengono migrate.
