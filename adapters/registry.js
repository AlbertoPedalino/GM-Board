/**
 * adapters/registry.js
 * Definisce i dizionari globali degli adapter e le funzioni di registrazione.
 * Caricato prima di manifest.js e loader.js.
 */

const ClassAdapters    = {};
const SubclassAdapters = {};
const SpeciesAdapters  = {};

function registerClassAdapter(name, fn)    { ClassAdapters[name]    = fn; }
function registerSubclassAdapter(key, fn)  { SubclassAdapters[key]  = fn; }
function registerSpeciesAdapter(key, fn)   { SpeciesAdapters[key]   = fn; }

// Utility: rimuove tag 5etools ({@skill Foo|XPHB} → "Foo")
function _cleanTagName(str) {
  if (typeof str !== 'string') return str;
  return str.split('|')[0].replace(/\{@\w+ /g, '').replace(/\}/g, '');
}
