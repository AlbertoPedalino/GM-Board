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
const SpeciesSheetActions = {};
const SpeciesSheetResources = {};
const SpeciesSheetFeatureFilters = {};
const SpeciesSheetChoiceMeta = {};

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

function registerSpeciesSheetActions(key, actions) {
  SpeciesSheetActions[key] = Array.isArray(actions) ? actions : [];
}

function registerSpeciesSheetResources(key, resources) {
  SpeciesSheetResources[key] = Array.isArray(resources) ? resources : [];
}

function registerSpeciesSheetFeatureFilter(key, fn) {
  _pushSheetFilter(SpeciesSheetFeatureFilters, key, fn);
}

function registerSpeciesSheetChoiceMeta(key, meta) {
  SpeciesSheetChoiceMeta[key] = _mergeSheetChoiceMeta(SpeciesSheetChoiceMeta[key], meta);
}

function registerSpeciesSheetCommonChoiceMeta(key, extraMeta) {
  registerSpeciesSheetChoiceMeta(key, {
    sectionTitle: 'Species Choices',
    isChoiceKey: function (choiceKey) {
      return /^species_/i.test(String(choiceKey || ''));
    },
    getLabel: function (choiceKey) {
      const labels = {
        species_version: 'Lineage/Ancestry',
        species_spell_ability: 'Species Spellcasting Ability',
        species_size: 'Size',
        species_origin_feat: 'Origin Feat (Species)',
        species_skill_tool_versatility: 'Skill Versatility',
      };
      const k = String(choiceKey || '');
      if (labels[k]) return labels[k];
      return k
        .replace(/^species_/, '')
        .replace(/_+/g, ' ')
        .replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); })
        .trim();
    },
    normalizeChoiceValue: function (value) {
      return String(value || '')
        .split('|')[0]
        .replace(/\{@\w+ /g, '')
        .replace(/\}/g, '')
        .trim();
    },
    ...(extraMeta && typeof extraMeta === 'object' ? extraMeta : {}),
  });
}

// Utility: rimuove tag 5etools ({@skill Foo|XPHB} -> "Foo")
function _cleanTagName(str) {
  if (typeof str !== 'string') return str;
  return str.split('|')[0].replace(/\{@\w+ /g, '').replace(/\}/g, '');
}
