/**
 * adapters/registry.js
 * Definisce i dizionari globali degli adapter e le funzioni di registrazione.
 * Caricato prima di manifest.js e loader.js.
 */

const ClassAdapters    = {};
const SubclassAdapters = {};
const SpeciesAdapters  = {};

const ClassSheetActions    = {};
const SubclassSheetActions = {};
const ClassSheetResources  = {};
const SubclassSheetResources = {};
const ClassSheetFeatureFilters = {};
const SubclassSheetFeatureFilters = {};
const ClassSheetChoiceMeta = {};
const SubclassSheetChoiceMeta = {};

function registerClassAdapter(name, fn)    { ClassAdapters[name]    = fn; }
function registerSubclassAdapter(key, fn)  { SubclassAdapters[key]  = fn; }
function registerSpeciesAdapter(key, fn)   { SpeciesAdapters[key]   = fn; }

function registerClassSheetActions(name, actions) {
  ClassSheetActions[name] = Array.isArray(actions) ? actions : [];
}
function registerSubclassSheetActions(key, actions) {
  SubclassSheetActions[key] = Array.isArray(actions) ? actions : [];
}

function registerClassSheetResources(name, resources) {
  ClassSheetResources[name] = Array.isArray(resources) ? resources : [];
}
function registerSubclassSheetResources(key, resources) {
  SubclassSheetResources[key] = Array.isArray(resources) ? resources : [];
}

function _pushSheetFilter(store, key, fn) {
  if (typeof fn !== 'function' || !key) return;
  if (!Array.isArray(store[key])) store[key] = [];
  store[key].push(fn);
}
function registerClassSheetFeatureFilter(name, fn) {
  _pushSheetFilter(ClassSheetFeatureFilters, name, fn);
}
function registerSubclassSheetFeatureFilter(key, fn) {
  _pushSheetFilter(SubclassSheetFeatureFilters, key, fn);
}

function _mergeSheetChoiceMeta(prev, next) {
  const p = prev && typeof prev === 'object' ? prev : {};
  const n = next && typeof next === 'object' ? next : {};
  return {
    ...p,
    ...n,
    labels: {
      ...(p.labels || {}),
      ...(n.labels || {}),
    },
  };
}
function registerClassSheetChoiceMeta(name, meta) {
  ClassSheetChoiceMeta[name] = _mergeSheetChoiceMeta(ClassSheetChoiceMeta[name], meta);
}
function registerSubclassSheetChoiceMeta(key, meta) {
  SubclassSheetChoiceMeta[key] = _mergeSheetChoiceMeta(SubclassSheetChoiceMeta[key], meta);
}

// Utility: rimuove tag 5etools ({@skill Foo|XPHB} -> "Foo")
function _cleanTagName(str) {
  if (typeof str !== 'string') return str;
  return str.split('|')[0].replace(/\{@\w+ /g, '').replace(/\}/g, '');
}