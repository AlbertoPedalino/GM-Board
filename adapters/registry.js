/**
 * adapters/registry.js
 * Dizionari globali + registrazione/lookup adapter con chiavi canoniche.
 * ES Module — importa da React; setta window per retrocompatibilità con runtime legacy.
 */

export const ClassAdapters    = {};
export const SubclassAdapters = {};
export const SpeciesAdapters  = {};
const FeatAdapters     = {};
const GlobalFeatAdapters = [];

const ClassSheetActions = {};
const SubclassSheetActions = {};
const ClassSheetResources = {};
const SubclassSheetResources = {};
const ClassSheetFeatureFilters = {};
const SubclassSheetFeatureFilters = {};
const ClassSheetChoiceMeta = {};
const SubclassSheetChoiceMeta = {};
const SpeciesSheetActions = {};
const SpeciesSheetResources = {};
const SpeciesSheetFeatureFilters = {};
const SpeciesSheetChoiceMeta = {};
const ClassSheetProficiencies = {};
const SubclassSheetProficiencies = {};
const SpeciesSheetProficiencies = {};
const ClassSheetSpellModifiers = {};
const SubclassSheetSpellModifiers = {};
const SpeciesSheetSpellModifiers = {};
const ClassRuntimeConfigs = {};
const SubclassRuntimeConfigs = {};
const SpeciesRuntimeConfigs = {};
const SpeciesSheetHpBonus = {};
const ClassChoiceKeyFilters = {};
const ClassChoiceLabelProviders = {};
const FeatSheetResources = {};
const FeatSheetActions   = {};
const WeaponAbilityOverrides = [];
const ClassAtWillSpells  = {};
const SpeciesLongRestGrants = {};
const ResourceSideEffects = {};

export function _normAdapterKey(v) {
  return String(v || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}
function _hasOwn(obj, key) {
  return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
}
function _splitFirstUnderscore(rawKey) {
  const s = String(rawKey || "");
  const i = s.indexOf("_");
  if (i < 0) return ["", ""];
  return [s.slice(0, i), s.slice(i + 1)];
}
function _splitLastUnderscore(rawKey) {
  const s = String(rawKey || "");
  const i = s.lastIndexOf("_");
  if (i < 0) return ["", ""];
  return [s.slice(0, i), s.slice(i + 1)];
}
function _toClassCanonicalKey(name) {
  return _normAdapterKey(name);
}
function _toSubclassCanonicalKey(className, subclassShortName) {
  const c = _normAdapterKey(className);
  const s = _normAdapterKey(subclassShortName);
  return c && s ? `${c}_${s}` : "";
}
function _toSubclassCanonicalKeyFromRaw(rawKey) {
  const parts = _splitFirstUnderscore(rawKey);
  return _toSubclassCanonicalKey(parts[0], parts[1]);
}
function _toSpeciesCanonicalKey(speciesName, speciesSource) {
  const n = _normAdapterKey(speciesName);
  const src = _normAdapterKey(speciesSource);
  return n && src ? `${n}_${src}` : "";
}
function _toFeatCanonicalKey(name, source) {
  const n = _normAdapterKey(name);
  const src = _normAdapterKey(source);
  return n && src ? `${n}_${src}` : n;
}
function _toSpeciesCanonicalKeyFromRaw(rawKey) {
  const parts = _splitLastUnderscore(rawKey);
  return _toSpeciesCanonicalKey(parts[0], parts[1]);
}
function _setStoreValue(store, rawKey, canonicalKey, value) {
  if (rawKey) store[rawKey] = value;
  if (canonicalKey) store[canonicalKey] = value;
}
function _getStoreValue(store, rawKey, canonicalKey) {
  if (_hasOwn(store, rawKey)) return store[rawKey];
  if (_hasOwn(store, canonicalKey)) return store[canonicalKey];
  return null;
}
function _setMetaValue(store, rawKey, canonicalKey, meta) {
  const merge = (prev, next) => {
    const p = prev && typeof prev === "object" ? prev : {};
    const n = next && typeof next === "object" ? next : {};
    return {
      ...p,
      ...n,
      labels: {
        ...(p.labels || {}),
        ...(n.labels || {}),
      },
    };
  };
  if (rawKey) store[rawKey] = merge(store[rawKey], meta);
  if (canonicalKey) store[canonicalKey] = merge(store[canonicalKey], meta);
}
function _pushSheetFilter(store, rawKey, canonicalKey, fn) {
  if (typeof fn !== "function") return;
  if (rawKey) {
    if (!Array.isArray(store[rawKey])) store[rawKey] = [];
    store[rawKey].push(fn);
  }
  if (canonicalKey) {
    if (!Array.isArray(store[canonicalKey])) store[canonicalKey] = [];
    store[canonicalKey].push(fn);
  }
}

function _sheetActionSign(v) {
  const n = Number(v || 0);
  return n >= 0 ? `+${n}` : String(n);
}
function _sheetActionModOf(character, ability) {
  if (!character || typeof getMod !== "function" || typeof getFinal !== "function") return 0;
  const a = String(ability || "").toLowerCase();
  if (!a) return 0;
  try { return Number(getMod(getFinal(a)) || 0); } catch (_) { return 0; }
}
function _sheetActionOwnerLevel(ctx) {
  const c = ctx?.character || {};
  return Number(ctx?.ownerLevel || c.classLevel || c.level || 1);
}
function _sheetActionNormalizeDice(formula) {
  return String(formula || "").replace(/[−–—]/g, "-").replace(/\s+/g, "").trim();
}
function _sheetActionBuildAutoDamageFormula(descText) {
  const desc = String(descText || "");
  if (!desc) return null;

  let m = desc.match(/(\d+d\d+)\s*\+\s*your\s*(STR|DEX|CON|INT|WIS|CHA)\s*modifier\s*\+\s*(?:your\s+)?[A-Za-z' ]*level/i);
  if (m) {
    const base = _sheetActionNormalizeDice(m[1]);
    const ab = String(m[2] || "").toLowerCase();
    return function (ctx) {
      const v = _sheetActionModOf(ctx?.character, ab) + _sheetActionOwnerLevel(ctx);
      return `${base}${_sheetActionSign(v)}`;
    };
  }
  m = desc.match(/(\d+d\d+)\s*\+\s*your\s*(STR|DEX|CON|INT|WIS|CHA)\s*modifier/i);
  if (m) {
    const base = _sheetActionNormalizeDice(m[1]);
    const ab = String(m[2] || "").toLowerCase();
    return function (ctx) {
      const v = _sheetActionModOf(ctx?.character, ab);
      return `${base}${_sheetActionSign(v)}`;
    };
  }
  m = desc.match(/(\d+d\d+)\s*\+\s*your\s*proficiency\s*bonus/i);
  if (m) {
    const base = _sheetActionNormalizeDice(m[1]);
    return function () {
      const pb = typeof getPB === "function" ? Number(getPB() || 0) : 0;
      return `${base}${_sheetActionSign(pb)}`;
    };
  }
  m = desc.match(/(\d+d\d+)\s*\+\s*half\s+your\s+[A-Za-z' ]*level/i);
  if (m) {
    const base = _sheetActionNormalizeDice(m[1]);
    return function (ctx) {
      const v = Math.floor(_sheetActionOwnerLevel(ctx) / 2);
      return `${base}${_sheetActionSign(v)}`;
    };
  }
  m = desc.match(/(\d+d\d+)\s*\+\s*(?:your\s+)?[A-Za-z' ]*level/i);
  if (m) {
    const base = _sheetActionNormalizeDice(m[1]);
    return function (ctx) {
      const v = _sheetActionOwnerLevel(ctx);
      return `${base}${_sheetActionSign(v)}`;
    };
  }
  m = desc.match(/\b(\d+d\d+(?:\s*[+-]\s*\d+)?)\b/i);
  if (m) {
    const formula = _sheetActionNormalizeDice(m[1]);
    return formula || null;
  }
  return null;
}
function _sheetActionEnrichRollMeta(action) {
  if (!action || typeof action !== "object") return action;
  return { ...action };
}
function _sheetActionsPrepare(actions) {
  return (Array.isArray(actions) ? actions : []).map(_sheetActionEnrichRollMeta);
}

export function registerClassAdapter(name, fn) {
  _setStoreValue(ClassAdapters, name, _toClassCanonicalKey(name), fn);
}
export function registerSubclassAdapter(key, fn) {
  _setStoreValue(SubclassAdapters, key, _toSubclassCanonicalKeyFromRaw(key), fn);
}
export function registerSpeciesAdapter(key, fn) {
  _setStoreValue(SpeciesAdapters, key, _toSpeciesCanonicalKeyFromRaw(key), fn);
}
export function registerFeatAdapter(key, fn) {
  if (typeof fn !== "function") return;
  if (typeof key === "string") {
    const raw = key;
    const canonical = key.includes("|")
      ? _toFeatCanonicalKey(raw.split("|")[0], raw.split("|")[1])
      : _toFeatCanonicalKey(raw, "");
    _setStoreValue(FeatAdapters, raw, canonical, fn);
    return;
  }
  if (key && typeof key === "object") {
    const raw = key.name && key.source ? `${key.name}|${key.source}` : key.name;
    const canonical = _toFeatCanonicalKey(key.name, key.source);
    _setStoreValue(FeatAdapters, raw || "", canonical, fn);
  }
}
export function registerGlobalFeatAdapter(fn) {
  if (typeof fn !== "function") return;
  GlobalFeatAdapters.push(fn);
}

export function registerClassSheetActions(name, actions) {
  _setStoreValue(
    ClassSheetActions,
    name,
    _toClassCanonicalKey(name),
    _sheetActionsPrepare(actions)
  );
}
export function registerSubclassSheetActions(key, actions) {
  _setStoreValue(
    SubclassSheetActions,
    key,
    _toSubclassCanonicalKeyFromRaw(key),
    _sheetActionsPrepare(actions)
  );
}

export function registerClassSheetResources(name, resources) {
  _setStoreValue(
    ClassSheetResources,
    name,
    _toClassCanonicalKey(name),
    Array.isArray(resources) ? resources : []
  );
}
export function registerSubclassSheetResources(key, resources) {
  _setStoreValue(
    SubclassSheetResources,
    key,
    _toSubclassCanonicalKeyFromRaw(key),
    Array.isArray(resources) ? resources : []
  );
}
export function registerClassSheetProficiencies(name, grants) {
  _setStoreValue(
    ClassSheetProficiencies,
    name,
    _toClassCanonicalKey(name),
    Array.isArray(grants) ? grants : []
  );
}
export function registerSubclassSheetProficiencies(key, grants) {
  _setStoreValue(
    SubclassSheetProficiencies,
    key,
    _toSubclassCanonicalKeyFromRaw(key),
    Array.isArray(grants) ? grants : []
  );
}
export function registerSpeciesSheetProficiencies(key, grants) {
  _setStoreValue(
    SpeciesSheetProficiencies,
    key,
    _toSpeciesCanonicalKeyFromRaw(key),
    Array.isArray(grants) ? grants : []
  );
}
export function registerClassSheetSpellModifiers(name, modifiers) {
  _setStoreValue(
    ClassSheetSpellModifiers,
    name,
    _toClassCanonicalKey(name),
    Array.isArray(modifiers) ? modifiers.filter(fn => typeof fn === "function") : []
  );
}
export function registerSubclassSheetSpellModifiers(key, modifiers) {
  _setStoreValue(
    SubclassSheetSpellModifiers,
    key,
    _toSubclassCanonicalKeyFromRaw(key),
    Array.isArray(modifiers) ? modifiers.filter(fn => typeof fn === "function") : []
  );
}
export function registerSpeciesSheetSpellModifiers(key, modifiers) {
  _setStoreValue(
    SpeciesSheetSpellModifiers,
    key,
    _toSpeciesCanonicalKeyFromRaw(key),
    Array.isArray(modifiers) ? modifiers.filter(fn => typeof fn === "function") : []
  );
}
export function registerClassRuntimeConfig(name, config) {
  _setStoreValue(
    ClassRuntimeConfigs,
    name,
    _toClassCanonicalKey(name),
    config && typeof config === "object" ? { ...config } : {}
  );
}
export function registerSubclassRuntimeConfig(key, config) {
  _setStoreValue(
    SubclassRuntimeConfigs,
    key,
    _toSubclassCanonicalKeyFromRaw(key),
    config && typeof config === "object" ? { ...config } : {}
  );
}
export function registerSpeciesRuntimeConfig(key, config) {
  _setStoreValue(
    SpeciesRuntimeConfigs,
    key,
    _toSpeciesCanonicalKeyFromRaw(key),
    config && typeof config === "object" ? { ...config } : {}
  );
}

export function registerClassSheetFeatureFilter(name, fn) {
  _pushSheetFilter(ClassSheetFeatureFilters, name, _toClassCanonicalKey(name), fn);
}
export function registerSubclassSheetFeatureFilter(key, fn) {
  _pushSheetFilter(SubclassSheetFeatureFilters, key, _toSubclassCanonicalKeyFromRaw(key), fn);
}

export function registerClassSheetChoiceMeta(name, meta) {
  _setMetaValue(ClassSheetChoiceMeta, name, _toClassCanonicalKey(name), meta);
}
export function registerSubclassSheetChoiceMeta(key, meta) {
  _setMetaValue(SubclassSheetChoiceMeta, key, _toSubclassCanonicalKeyFromRaw(key), meta);
}

export function registerSpeciesSheetActions(key, actions) {
  _setStoreValue(
    SpeciesSheetActions,
    key,
    _toSpeciesCanonicalKeyFromRaw(key),
    _sheetActionsPrepare(actions)
  );
}

export function registerSpeciesSheetResources(key, resources) {
  _setStoreValue(
    SpeciesSheetResources,
    key,
    _toSpeciesCanonicalKeyFromRaw(key),
    Array.isArray(resources) ? resources : []
  );
}

export function registerSpeciesSheetFeatureFilter(key, fn) {
  _pushSheetFilter(SpeciesSheetFeatureFilters, key, _toSpeciesCanonicalKeyFromRaw(key), fn);
}

export function registerSpeciesSheetChoiceMeta(key, meta) {
  _setMetaValue(SpeciesSheetChoiceMeta, key, _toSpeciesCanonicalKeyFromRaw(key), meta);
}

function _defaultChoiceLabel(choiceKey, prefixPattern) {
  return String(choiceKey || "")
    .replace(prefixPattern, "")
    .replace(/_+/g, " ")
    .replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); })
    .trim();
}
function _defaultChoiceNormalize(value) {
  return String(value || "")
    .split("|")[0]
    .replace(/\{@\w+ /g, "")
    .replace(/\}/g, "")
    .trim();
}
export function registerClassSheetCommonChoiceMeta(name, extraMeta) {
  registerClassSheetChoiceMeta(name, {
    sectionTitle: "Class Choices",
    isChoiceKey: function (choiceKey) {
      return (
        /^(start_|feat_|class_|subclass_|ranger_|rogue_|bard_|wizard_|druid_|monk_|paladin_|cleric_|fighter_|sorcerer_|warlock_|barbarian_|artificer_|auto_)/i
          .test(String(choiceKey || "")) &&
        !/^species_/i.test(String(choiceKey || ""))
      );
    },
    getLabel: function (choiceKey) {
      const k = String(choiceKey || "");
      if (/^start_skills_lv\d+_\d+$/.test(k)) return "Class Skills";
      const fKnown = k.match(/^feat_.*_known_lv(\d+)_\d+$/);
      if (fKnown) return fKnown[1] === "0" ? "Cantrip (Origin Feat)" : `Spell Lv.${fKnown[1]} (Origin Feat)`;
      const fInnate = k.match(/^feat_.*_innate_.*_lv(\d+)_\d+$/);
      if (fInnate) return fInnate[1] === "0" ? "Innate Cantrip (Origin Feat)" : `Innate Spell Lv.${fInnate[1]} (Origin Feat)`;
      return _defaultChoiceLabel(k, /^(start_|feat_|class_|subclass_|auto_(primary|ec\d+)_feat_)/);
    },
    normalizeChoiceValue: _defaultChoiceNormalize,
    ...(extraMeta && typeof extraMeta === "object" ? extraMeta : {}),
  });
}
export function registerSubclassSheetCommonChoiceMeta(key, extraMeta) {
  registerSubclassSheetChoiceMeta(key, {
    sectionTitle: "Class Choices",
    isChoiceKey: function (choiceKey, ctx) {
      const k = String(choiceKey || "");
      const prefix = String(ctx?.choicePrefix || "");
      const local = prefix && k.startsWith(prefix) ? k.slice(prefix.length) : k;
      return /^(subclass_|armorer_|wizard_|sorcerer_|rogue_|ranger_|fighter_|bard_|druid_|paladin_|warlock_|monk_|cleric_|barbarian_|artificer_|auto_)/i.test(local);
    },
    getLabel: function (choiceKey, ctx) {
      const prefix = String(ctx?.choicePrefix || "");
      const k = String(choiceKey || "");
      const local = prefix && k.startsWith(prefix) ? k.slice(prefix.length) : k;
      return _defaultChoiceLabel(local, /^(subclass_|auto_(primary|ec\d+)_feat_)/);
    },
    normalizeChoiceValue: _defaultChoiceNormalize,
    ...(extraMeta && typeof extraMeta === "object" ? extraMeta : {}),
  });
}

export function registerSpeciesSheetCommonChoiceMeta(key, extraMeta) {
  registerSpeciesSheetChoiceMeta(key, {
    sectionTitle: "Species Choices",
    isChoiceKey: function (choiceKey) {
      return /^species_/i.test(String(choiceKey || ""));
    },
    getLabel: function (choiceKey) {
      const labels = {
        species_version: "Lineage/Ancestry",
        species_spell_ability: "Species Spellcasting Ability",
        species_size: "Size",
        species_origin_feat: "Origin Feat (Species)",
        species_skill_tool_versatility: "Skill Versatility",
        species_language_default: "Species Languages",
      };
      const k = String(choiceKey || "");
      if (labels[k]) return labels[k];
      if (/^species_skill_\d+$/.test(k)) return "Skill";
      const sKnown = k.match(/^species_.*_known_lv(\d+)_\d+$/);
      if (sKnown) return sKnown[1] === "0" ? "Cantrip (Origin Feat)" : `Spell Lv.${sKnown[1]} (Origin Feat)`;
      const sInnate = k.match(/^species_.*_innate_.*_lv(\d+)_\d+$/);
      if (sInnate) return sInnate[1] === "0" ? "Innate Cantrip (Origin Feat)" : `Innate Spell Lv.${sInnate[1]} (Origin Feat)`;
      const sKnownDirect = k.match(/^species_known_lv(\d+)_\d+$/);
      if (sKnownDirect) return sKnownDirect[1] === "0" ? "Cantrip (Species)" : `Spell Lv.${sKnownDirect[1]} (Species)`;
      const sInnateDirect = k.match(/^species_innate_.*_lv(\d+)_\d+$/);
      if (sInnateDirect) return sInnateDirect[1] === "0" ? "Innate Cantrip (Species)" : `Innate Spell Lv.${sInnateDirect[1]} (Species)`;
      return _defaultChoiceLabel(k, /^species_/);
    },
    normalizeChoiceValue: _defaultChoiceNormalize,
    ...(extraMeta && typeof extraMeta === "object" ? extraMeta : {}),
  });
}

export function getClassAdapter(name) {
  return _getStoreValue(ClassAdapters, name, _toClassCanonicalKey(name));
}
export function getSubclassAdapter(className, subclassShortName) {
  const raw = className && subclassShortName ? `${className}_${subclassShortName}` : "";
  return _getStoreValue(SubclassAdapters, raw, _toSubclassCanonicalKey(className, subclassShortName));
}
export function getSpeciesAdapter(speciesName, speciesSource) {
  const raw = speciesName && speciesSource ? `${speciesName}_${speciesSource}` : "";
  return _getStoreValue(SpeciesAdapters, raw, _toSpeciesCanonicalKey(speciesName, speciesSource));
}
export function getFeatAdapter(name, source) {
  const raw = name && source ? `${name}|${source}` : String(name || "");
  return _getStoreValue(FeatAdapters, raw, _toFeatCanonicalKey(name, source));
}
export function getGlobalFeatAdapters() {
  return GlobalFeatAdapters.slice();
}

export function getClassSheetActions(name) {
  return _getStoreValue(ClassSheetActions, name, _toClassCanonicalKey(name)) || [];
}
export function getSubclassSheetActions(className, subclassShortName) {
  const raw = className && subclassShortName ? `${className}_${subclassShortName}` : "";
  return _getStoreValue(SubclassSheetActions, raw, _toSubclassCanonicalKey(className, subclassShortName)) || [];
}
export function getClassSheetResources(name) {
  return _getStoreValue(ClassSheetResources, name, _toClassCanonicalKey(name)) || [];
}
export function getSubclassSheetResources(className, subclassShortName) {
  const raw = className && subclassShortName ? `${className}_${subclassShortName}` : "";
  return _getStoreValue(SubclassSheetResources, raw, _toSubclassCanonicalKey(className, subclassShortName)) || [];
}
export function getClassSheetFeatureFilters(name) {
  return _getStoreValue(ClassSheetFeatureFilters, name, _toClassCanonicalKey(name)) || [];
}
export function getSubclassSheetFeatureFilters(className, subclassShortName) {
  const raw = className && subclassShortName ? `${className}_${subclassShortName}` : "";
  return _getStoreValue(SubclassSheetFeatureFilters, raw, _toSubclassCanonicalKey(className, subclassShortName)) || [];
}
export function getClassSheetChoiceMeta(name) {
  return _getStoreValue(ClassSheetChoiceMeta, name, _toClassCanonicalKey(name)) || {};
}
export function getSubclassSheetChoiceMeta(className, subclassShortName) {
  const raw = className && subclassShortName ? `${className}_${subclassShortName}` : "";
  return _getStoreValue(SubclassSheetChoiceMeta, raw, _toSubclassCanonicalKey(className, subclassShortName)) || {};
}

export function getSpeciesSheetActions(speciesName, speciesSource) {
  const raw = speciesName && speciesSource ? `${speciesName}_${speciesSource}` : "";
  return _getStoreValue(SpeciesSheetActions, raw, _toSpeciesCanonicalKey(speciesName, speciesSource)) || [];
}
export function getSpeciesSheetResources(speciesName, speciesSource) {
  const raw = speciesName && speciesSource ? `${speciesName}_${speciesSource}` : "";
  return _getStoreValue(SpeciesSheetResources, raw, _toSpeciesCanonicalKey(speciesName, speciesSource)) || [];
}
export function getSpeciesSheetFeatureFilters(speciesName, speciesSource) {
  const raw = speciesName && speciesSource ? `${speciesName}_${speciesSource}` : "";
  return _getStoreValue(SpeciesSheetFeatureFilters, raw, _toSpeciesCanonicalKey(speciesName, speciesSource)) || [];
}
export function getSpeciesSheetChoiceMeta(speciesName, speciesSource) {
  const raw = speciesName && speciesSource ? `${speciesName}_${speciesSource}` : "";
  return _getStoreValue(SpeciesSheetChoiceMeta, raw, _toSpeciesCanonicalKey(speciesName, speciesSource)) || {};
}
export function getClassSheetProficiencies(name) {
  return _getStoreValue(ClassSheetProficiencies, name, _toClassCanonicalKey(name)) || [];
}
export function getSubclassSheetProficiencies(className, subclassShortName) {
  const raw = className && subclassShortName ? `${className}_${subclassShortName}` : "";
  return _getStoreValue(SubclassSheetProficiencies, raw, _toSubclassCanonicalKey(className, subclassShortName)) || [];
}
export function getSpeciesSheetProficiencies(speciesName, speciesSource) {
  const raw = speciesName && speciesSource ? `${speciesName}_${speciesSource}` : "";
  return _getStoreValue(SpeciesSheetProficiencies, raw, _toSpeciesCanonicalKey(speciesName, speciesSource)) || [];
}
export function getClassSheetSpellModifiers(name) {
  return _getStoreValue(ClassSheetSpellModifiers, name, _toClassCanonicalKey(name)) || [];
}
export function getSubclassSheetSpellModifiers(className, subclassShortName) {
  const raw = className && subclassShortName ? `${className}_${subclassShortName}` : "";
  return _getStoreValue(SubclassSheetSpellModifiers, raw, _toSubclassCanonicalKey(className, subclassShortName)) || [];
}
export function getSpeciesSheetSpellModifiers(speciesName, speciesSource) {
  const raw = speciesName && speciesSource ? `${speciesName}_${speciesSource}` : "";
  return _getStoreValue(SpeciesSheetSpellModifiers, raw, _toSpeciesCanonicalKey(speciesName, speciesSource)) || [];
}
export function getClassRuntimeConfig(name) {
  return _getStoreValue(ClassRuntimeConfigs, name, _toClassCanonicalKey(name)) || {};
}
export function getSubclassRuntimeConfig(className, subclassShortName) {
  const raw = className && subclassShortName ? `${className}_${subclassShortName}` : "";
  return _getStoreValue(SubclassRuntimeConfigs, raw, _toSubclassCanonicalKey(className, subclassShortName)) || {};
}
export function getSpeciesRuntimeConfig(speciesName, speciesSource) {
  const raw = speciesName && speciesSource ? `${speciesName}_${speciesSource}` : "";
  return _getStoreValue(SpeciesRuntimeConfigs, raw, _toSpeciesCanonicalKey(speciesName, speciesSource)) || {};
}

export function registerSpeciesSheetHpBonus(key, bonusPerLevel) {
  _setStoreValue(SpeciesSheetHpBonus, key, _toSpeciesCanonicalKeyFromRaw(key), Number(bonusPerLevel) || 0);
}
export function getSpeciesSheetHpBonus(speciesName, speciesSource) {
  const raw = speciesName && speciesSource ? `${speciesName}_${speciesSource}` : speciesName || "";
  const canonical = _toSpeciesCanonicalKey(speciesName, speciesSource || "");
  const val = _getStoreValue(SpeciesSheetHpBonus, raw, canonical);
  return typeof val === "number" ? val : 0;
}

export function registerClassChoiceKeyFilter(className, fn) {
  if (typeof fn !== "function") return;
  _setStoreValue(ClassChoiceKeyFilters, className, _toClassCanonicalKey(className), fn);
}
export function getClassChoiceKeyFilter(className) {
  return _getStoreValue(ClassChoiceKeyFilters, className, _toClassCanonicalKey(className)) || null;
}

export function registerClassChoiceLabelProvider(className, fn) {
  if (typeof fn !== "function") return;
  _setStoreValue(ClassChoiceLabelProviders, className, _toClassCanonicalKey(className), fn);
}
export function getClassChoiceLabelProvider(className) {
  return _getStoreValue(ClassChoiceLabelProviders, className, _toClassCanonicalKey(className)) || null;
}

export function registerWeaponAbilityOverride(cfg) {
  if (!cfg || !cfg.key || !cfg.ability || typeof cfg.condition !== 'function') return;
  WeaponAbilityOverrides.push(cfg);
}
export function getWeaponAbilityOverrides() {
  return WeaponAbilityOverrides.slice();
}

export function registerClassAtWillSpells(className, map) {
  const k = _normAdapterKey(className);
  ClassAtWillSpells[String(className)] = Array.isArray(map) ? map : [];
  if (k) ClassAtWillSpells[k] = Array.isArray(map) ? map : [];
}
export function getClassAtWillSpells(className) {
  const raw = String(className || '');
  const k = _normAdapterKey(raw);
  return ClassAtWillSpells[raw] || ClassAtWillSpells[k] || null;
}

export function registerSpeciesLongRestGrants(speciesName, speciesSource, grants) {
  const raw = speciesName && speciesSource ? `${speciesName}_${speciesSource}` : String(speciesName || '');
  const k = _toSpeciesCanonicalKey(speciesName, speciesSource);
  SpeciesLongRestGrants[raw] = grants;
  if (k) SpeciesLongRestGrants[k] = grants;
}
export function getSpeciesLongRestGrants(speciesName, speciesSource) {
  const raw = speciesName && speciesSource ? `${speciesName}_${speciesSource}` : String(speciesName || '');
  const k = _toSpeciesCanonicalKey(speciesName, speciesSource);
  return SpeciesLongRestGrants[raw] || SpeciesLongRestGrants[k] || null;
}

export function registerResourceSideEffect(key, fn) {
  if (typeof fn !== 'function') return;
  ResourceSideEffects[String(key)] = fn;
}
export function getResourceSideEffect(key) {
  return ResourceSideEffects[String(key)] || null;
}

export function registerFeatSheetResources(name, resources) {
  const k = _normAdapterKey(name);
  FeatSheetResources[String(name)] = Array.isArray(resources) ? resources : [];
  if (k) FeatSheetResources[k] = Array.isArray(resources) ? resources : [];
}
export function getFeatSheetResources(name) {
  const raw = String(name || "");
  const k   = _normAdapterKey(raw);
  return FeatSheetResources[raw] || FeatSheetResources[k] || [];
}
export function registerFeatSheetActions(name, actions) {
  const k = _normAdapterKey(name);
  FeatSheetActions[String(name)] = Array.isArray(actions) ? actions : [];
  if (k) FeatSheetActions[k] = Array.isArray(actions) ? actions : [];
}
export function getFeatSheetActions(name) {
  const raw = String(name || "");
  const k   = _normAdapterKey(raw);
  return FeatSheetActions[raw] || FeatSheetActions[k] || [];
}

// ── Item Flag Definitions ──
const ItemFlagDefs = {};
export function registerItemFlagDef(key, def) {
  if (!key || !def || typeof def !== 'object') return;
  ItemFlagDefs[String(key)] = { key: String(key), ...def };
}
export function getItemFlagDef(key) { return ItemFlagDefs[String(key)] || null; }
export function getAllItemFlagDefs() { return Object.values(ItemFlagDefs); }

// ── Sheet Effects ──
const ClassSheetEffects = {};
const SubclassSheetEffects = {};
const SpeciesSheetEffects = {};
const FeatSheetEffects = {};

export function registerClassSheetEffects(name, effects) {
  _setStoreValue(ClassSheetEffects, name, _toClassCanonicalKey(name), Array.isArray(effects) ? effects : []);
}
export function registerSubclassSheetEffects(key, effects) {
  _setStoreValue(SubclassSheetEffects, key, _toSubclassCanonicalKeyFromRaw(key), Array.isArray(effects) ? effects : []);
}
export function registerSpeciesSheetEffects(key, effects) {
  _setStoreValue(SpeciesSheetEffects, key, _toSpeciesCanonicalKeyFromRaw(key), Array.isArray(effects) ? effects : []);
}
export function registerFeatSheetEffects(name, effects) {
  const k = _normAdapterKey(name);
  const arr = Array.isArray(effects) ? effects : [];
  FeatSheetEffects[String(name)] = arr;
  if (k) FeatSheetEffects[k] = arr;
}
export function getClassSheetEffects(name) {
  return _getStoreValue(ClassSheetEffects, name, _toClassCanonicalKey(name)) || [];
}
export function getSubclassSheetEffects(className, subclassShortName) {
  const raw = className && subclassShortName ? `${className}_${subclassShortName}` : "";
  return _getStoreValue(SubclassSheetEffects, raw, _toSubclassCanonicalKey(className, subclassShortName)) || [];
}
export function getSpeciesSheetEffects(speciesName, speciesSource) {
  const raw = speciesName && speciesSource ? `${speciesName}_${speciesSource}` : speciesName || "";
  return _getStoreValue(SpeciesSheetEffects, raw, _toSpeciesCanonicalKey(speciesName, speciesSource)) || [];
}
export function getFeatSheetEffects(name) {
  const raw = String(name || "");
  const k = _normAdapterKey(raw);
  return FeatSheetEffects[raw] || FeatSheetEffects[k] || [];
}

const SubclassChoiceDetailDataProviders = {};
export function registerSubclassChoiceDetailDataProvider(className, subclassShortName, fn) {
  if (typeof fn !== "function") return;
  const raw = className && subclassShortName ? `${className}_${subclassShortName}` : "";
  _setStoreValue(SubclassChoiceDetailDataProviders, raw, _toSubclassCanonicalKey(className, subclassShortName), fn);
}
export function getSubclassChoiceDetailDataProvider(className, subclassShortName) {
  const raw = className && subclassShortName ? `${className}_${subclassShortName}` : "";
  return _getStoreValue(SubclassChoiceDetailDataProviders, raw, _toSubclassCanonicalKey(className, subclassShortName)) || null;
}

// ── Spell / Cantrip data stores ──
const CantripDataStore = {};
const SpellDataStore   = {};
const GlobalSpellAdapters = [];
const GlobalClassAdapters = [];
const GlobalSubclassAdapters = [];
const GlobalItemAdapters = [];
const CantripDataModifiers = {};

export function registerCantripData(name, data) {
  if (!name || !data || typeof data !== "object") return;
  const key = _normAdapterKey(name);
  CantripDataStore[String(name)] = data;
  if (key) CantripDataStore[key] = data;
}
export function getCantripData(name) {
  const raw = String(name || "");
  const key = _normAdapterKey(raw);
  return _getStoreValue(CantripDataStore, raw, key) || null;
}
export function registerCantripDataModifier(name, fn) {
  if (!name || typeof fn !== 'function') return;
  const raw = String(name);
  const key = _normAdapterKey(raw);
  const existing = (_getStoreValue(CantripDataModifiers, raw, key) || []).slice();
  existing.push(fn);
  _setStoreValue(CantripDataModifiers, raw, key, existing);
}
export function getCantripDataModifiers(name) {
  const raw = String(name || '');
  const key = _normAdapterKey(raw);
  return _getStoreValue(CantripDataModifiers, raw, key) || [];
}

export function registerSpellData(name, data) {
  if (!name || !data || typeof data !== "object") return;
  const key = _normAdapterKey(name);
  SpellDataStore[String(name)] = data;
  if (key) SpellDataStore[key] = data;
}
export function getSpellData(name) {
  const raw = String(name || "");
  const key = _normAdapterKey(raw);
  return _getStoreValue(SpellDataStore, raw, key) || null;
}

export function registerGlobalSpellAdapter(fn) {
  if (typeof fn !== "function") return;
  GlobalSpellAdapters.push(fn);
}
export function getGlobalSpellAdapters() {
  return GlobalSpellAdapters.slice();
}

export function registerGlobalClassAdapter(fn) {
  if (typeof fn !== "function") return;
  GlobalClassAdapters.push(fn);
}
export function getGlobalClassAdapters() {
  return GlobalClassAdapters.slice();
}

export function registerGlobalSubclassAdapter(fn) {
  if (typeof fn !== "function") return;
  GlobalSubclassAdapters.push(fn);
}
export function getGlobalSubclassAdapters() {
  return GlobalSubclassAdapters.slice();
}

export function registerGlobalItemAdapter(fn) {
  if (typeof fn !== "function") return;
  GlobalItemAdapters.push(fn);
}
export function getGlobalItemAdapters() {
  return GlobalItemAdapters.slice();
}

const GlobalSpeciesAdapters = [];
export function registerGlobalSpeciesAdapter(fn) {
  if (typeof fn !== "function") return;
  GlobalSpeciesAdapters.push(fn);
}
export function getGlobalSpeciesAdapters() {
  return GlobalSpeciesAdapters.slice();
}

// ── Shared game constants ──
export const _ARTISAN_TOOLS = [
  "Alchemist's Supplies", "Brewer's Supplies", "Calligrapher's Supplies",
  "Carpenter's Tools", "Cartographer's Tools", "Cobbler's Tools",
  "Cook's Utensils", "Glassblower's Tools", "Jeweler's Tools",
  "Leatherworker's Tools", "Mason's Tools", "Painter's Supplies",
  "Potter's Tools", "Smith's Tools", "Tinker's Tools",
  "Weaver's Tools", "Woodcarver's Tools",
];
export const _MUSICAL_INSTRUMENTS = [
  'Bagpipes', 'Drum', 'Dulcimer', 'Flute', 'Hand Drum',
  'Horn', 'Lute', 'Lyre', 'Pan Flute', 'Shawm', 'Viol',
];
export const _GAMING_SETS = [
  'Dice Set', 'Dragonchess Set', 'Playing Card Set', 'Three-Dragon Ante Set',
];
export const _VEHICLE_TOOLS = [
  'Vehicles (Land)', 'Vehicles (Water)',
];
export const _STD_LANGS = [
  'Common', 'Common Sign Language', 'Draconic', 'Dwarvish', 'Elvish',
  'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc',
];
export const _EXOTIC_LANGS = [
  'Abyssal', 'Celestial', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon',
];
export const _ALL_LANGS = [..._STD_LANGS, ..._EXOTIC_LANGS];
export const _ALL_TOOLS = [
  ..._ARTISAN_TOOLS,
  ..._MUSICAL_INSTRUMENTS,
  ..._GAMING_SETS,
  ..._VEHICLE_TOOLS,
  "Thieves' Tools", 'Disguise Kit', 'Forgery Kit',
  "Herbalism Kit", "Navigator's Tools", "Poisoner's Kit",
];

// Utility: rimuove tag 5etools
export function _cleanTagName(str) {
  if (typeof str !== "string") return str;
  return str.split("|")[0].replace(/\{@\w+ /g, "").replace(/\}/g, "");
}

// ── Window globals per retrocompatibilità col runtime legacy ──
const _glob = typeof window !== 'undefined' ? window : null;
if (_glob) {
  _glob.ClassAdapters = ClassAdapters;
  _glob.SubclassAdapters = SubclassAdapters;
  _glob.SpeciesAdapters = SpeciesAdapters;
  _glob.FeatAdapters = FeatAdapters;
  _glob.GlobalFeatAdapters = GlobalFeatAdapters;
  _glob.ClassSheetActions = ClassSheetActions;
  _glob.SubclassSheetActions = SubclassSheetActions;
  _glob.ClassSheetResources = ClassSheetResources;
  _glob.SubclassSheetResources = SubclassSheetResources;
  _glob.ClassSheetFeatureFilters = ClassSheetFeatureFilters;
  _glob.SubclassSheetFeatureFilters = SubclassSheetFeatureFilters;
  _glob.ClassSheetChoiceMeta = ClassSheetChoiceMeta;
  _glob.SubclassSheetChoiceMeta = SubclassSheetChoiceMeta;
  _glob.SpeciesSheetActions = SpeciesSheetActions;
  _glob.SpeciesSheetResources = SpeciesSheetResources;
  _glob.SpeciesSheetFeatureFilters = SpeciesSheetFeatureFilters;
  _glob.SpeciesSheetChoiceMeta = SpeciesSheetChoiceMeta;
  _glob.ClassSheetProficiencies = ClassSheetProficiencies;
  _glob.SubclassSheetProficiencies = SubclassSheetProficiencies;
  _glob.SpeciesSheetProficiencies = SpeciesSheetProficiencies;
  _glob.ClassSheetSpellModifiers = ClassSheetSpellModifiers;
  _glob.SubclassSheetSpellModifiers = SubclassSheetSpellModifiers;
  _glob.SpeciesSheetSpellModifiers = SpeciesSheetSpellModifiers;
  _glob.ClassRuntimeConfigs = ClassRuntimeConfigs;
  _glob.SubclassRuntimeConfigs = SubclassRuntimeConfigs;
  _glob.SpeciesRuntimeConfigs = SpeciesRuntimeConfigs;
  _glob.SpeciesSheetHpBonus = SpeciesSheetHpBonus;
  _glob.ClassChoiceKeyFilters = ClassChoiceKeyFilters;
  _glob.ClassChoiceLabelProviders = ClassChoiceLabelProviders;
  _glob.FeatSheetResources = FeatSheetResources;
  _glob.FeatSheetActions = FeatSheetActions;
  _glob.WeaponAbilityOverrides = WeaponAbilityOverrides;
  _glob.ClassAtWillSpells = ClassAtWillSpells;
  _glob.SpeciesLongRestGrants = SpeciesLongRestGrants;
  _glob.ResourceSideEffects = ResourceSideEffects;
  _glob.ClassSheetEffects = ClassSheetEffects;
  _glob.SubclassSheetEffects = SubclassSheetEffects;
  _glob.SpeciesSheetEffects = SpeciesSheetEffects;
  _glob.FeatSheetEffects = FeatSheetEffects;
  _glob.SubclassChoiceDetailDataProviders = SubclassChoiceDetailDataProviders;
  _glob.CantripDataStore = CantripDataStore;
  _glob.SpellDataStore = SpellDataStore;
  _glob.GlobalSpellAdapters = GlobalSpellAdapters;
  _glob.GlobalClassAdapters = GlobalClassAdapters;
  _glob.GlobalSubclassAdapters = GlobalSubclassAdapters;
  _glob.GlobalItemAdapters = GlobalItemAdapters;
  _glob.CantripDataModifiers = CantripDataModifiers;
  _glob.GlobalSpeciesAdapters = GlobalSpeciesAdapters;
  _glob.ItemFlagDefs = ItemFlagDefs;

  _glob._normAdapterKey = _normAdapterKey;
  _glob._toClassCanonicalKey = _toClassCanonicalKey;
  _glob._toSubclassCanonicalKey = _toSubclassCanonicalKey;
  _glob._toSubclassCanonicalKeyFromRaw = _toSubclassCanonicalKeyFromRaw;
  _glob._toSpeciesCanonicalKey = _toSpeciesCanonicalKey;
  _glob._toFeatCanonicalKey = _toFeatCanonicalKey;
  _glob._toSpeciesCanonicalKeyFromRaw = _toSpeciesCanonicalKeyFromRaw;
  _glob._sheetActionSign = _sheetActionSign;
  _glob._sheetActionModOf = _sheetActionModOf;
  _glob._sheetActionOwnerLevel = _sheetActionOwnerLevel;
  _glob._sheetActionNormalizeDice = _sheetActionNormalizeDice;
  _glob._sheetActionBuildAutoDamageFormula = _sheetActionBuildAutoDamageFormula;
  _glob._sheetActionEnrichRollMeta = _sheetActionEnrichRollMeta;
  _glob._sheetActionsPrepare = _sheetActionsPrepare;
  _glob._defaultChoiceLabel = _defaultChoiceLabel;
  _glob._defaultChoiceNormalize = _defaultChoiceNormalize;
  _glob._cleanTagName = _cleanTagName;

  _glob.registerClassAdapter = registerClassAdapter;
  _glob.registerSubclassAdapter = registerSubclassAdapter;
  _glob.registerSpeciesAdapter = registerSpeciesAdapter;
  _glob.registerFeatAdapter = registerFeatAdapter;
  _glob.registerGlobalFeatAdapter = registerGlobalFeatAdapter;
  _glob.registerClassSheetActions = registerClassSheetActions;
  _glob.registerSubclassSheetActions = registerSubclassSheetActions;
  _glob.registerClassSheetResources = registerClassSheetResources;
  _glob.registerSubclassSheetResources = registerSubclassSheetResources;
  _glob.registerClassSheetProficiencies = registerClassSheetProficiencies;
  _glob.registerSubclassSheetProficiencies = registerSubclassSheetProficiencies;
  _glob.registerSpeciesSheetProficiencies = registerSpeciesSheetProficiencies;
  _glob.registerClassSheetSpellModifiers = registerClassSheetSpellModifiers;
  _glob.registerSubclassSheetSpellModifiers = registerSubclassSheetSpellModifiers;
  _glob.registerSpeciesSheetSpellModifiers = registerSpeciesSheetSpellModifiers;
  _glob.registerClassRuntimeConfig = registerClassRuntimeConfig;
  _glob.registerSubclassRuntimeConfig = registerSubclassRuntimeConfig;
  _glob.registerSpeciesRuntimeConfig = registerSpeciesRuntimeConfig;
  _glob.registerClassSheetFeatureFilter = registerClassSheetFeatureFilter;
  _glob.registerSubclassSheetFeatureFilter = registerSubclassSheetFeatureFilter;
  _glob.registerClassSheetChoiceMeta = registerClassSheetChoiceMeta;
  _glob.registerSubclassSheetChoiceMeta = registerSubclassSheetChoiceMeta;
  _glob.registerSpeciesSheetActions = registerSpeciesSheetActions;
  _glob.registerSpeciesSheetResources = registerSpeciesSheetResources;
  _glob.registerSpeciesSheetFeatureFilter = registerSpeciesSheetFeatureFilter;
  _glob.registerSpeciesSheetChoiceMeta = registerSpeciesSheetChoiceMeta;
  _glob.registerClassSheetCommonChoiceMeta = registerClassSheetCommonChoiceMeta;
  _glob.registerSubclassSheetCommonChoiceMeta = registerSubclassSheetCommonChoiceMeta;
  _glob.registerSpeciesSheetCommonChoiceMeta = registerSpeciesSheetCommonChoiceMeta;
  _glob.getClassAdapter = getClassAdapter;
  _glob.getSubclassAdapter = getSubclassAdapter;
  _glob.getSpeciesAdapter = getSpeciesAdapter;
  _glob.getFeatAdapter = getFeatAdapter;
  _glob.getGlobalFeatAdapters = getGlobalFeatAdapters;
  _glob.getClassSheetActions = getClassSheetActions;
  _glob.getSubclassSheetActions = getSubclassSheetActions;
  _glob.getClassSheetResources = getClassSheetResources;
  _glob.getSubclassSheetResources = getSubclassSheetResources;
  _glob.getClassSheetFeatureFilters = getClassSheetFeatureFilters;
  _glob.getSubclassSheetFeatureFilters = getSubclassSheetFeatureFilters;
  _glob.getClassSheetChoiceMeta = getClassSheetChoiceMeta;
  _glob.getSubclassSheetChoiceMeta = getSubclassSheetChoiceMeta;
  _glob.getSpeciesSheetActions = getSpeciesSheetActions;
  _glob.getSpeciesSheetResources = getSpeciesSheetResources;
  _glob.getSpeciesSheetFeatureFilters = getSpeciesSheetFeatureFilters;
  _glob.getSpeciesSheetChoiceMeta = getSpeciesSheetChoiceMeta;
  _glob.getClassSheetProficiencies = getClassSheetProficiencies;
  _glob.getSubclassSheetProficiencies = getSubclassSheetProficiencies;
  _glob.getSpeciesSheetProficiencies = getSpeciesSheetProficiencies;
  _glob.getClassSheetSpellModifiers = getClassSheetSpellModifiers;
  _glob.getSubclassSheetSpellModifiers = getSubclassSheetSpellModifiers;
  _glob.getSpeciesSheetSpellModifiers = getSpeciesSheetSpellModifiers;
  _glob.getClassRuntimeConfig = getClassRuntimeConfig;
  _glob.getSubclassRuntimeConfig = getSubclassRuntimeConfig;
  _glob.getSpeciesRuntimeConfig = getSpeciesRuntimeConfig;
  _glob.registerSpeciesSheetHpBonus = registerSpeciesSheetHpBonus;
  _glob.getSpeciesSheetHpBonus = getSpeciesSheetHpBonus;
  _glob.registerClassChoiceKeyFilter = registerClassChoiceKeyFilter;
  _glob.getClassChoiceKeyFilter = getClassChoiceKeyFilter;
  _glob.registerClassChoiceLabelProvider = registerClassChoiceLabelProvider;
  _glob.getClassChoiceLabelProvider = getClassChoiceLabelProvider;
  _glob.registerWeaponAbilityOverride = registerWeaponAbilityOverride;
  _glob.getWeaponAbilityOverrides = getWeaponAbilityOverrides;
  _glob.registerClassAtWillSpells = registerClassAtWillSpells;
  _glob.getClassAtWillSpells = getClassAtWillSpells;
  _glob.registerSpeciesLongRestGrants = registerSpeciesLongRestGrants;
  _glob.getSpeciesLongRestGrants = getSpeciesLongRestGrants;
  _glob.registerResourceSideEffect = registerResourceSideEffect;
  _glob.getResourceSideEffect = getResourceSideEffect;
  _glob.registerFeatSheetResources = registerFeatSheetResources;
  _glob.getFeatSheetResources = getFeatSheetResources;
  _glob.registerFeatSheetActions = registerFeatSheetActions;
  _glob.getFeatSheetActions = getFeatSheetActions;
  _glob.registerItemFlagDef = registerItemFlagDef;
  _glob.getItemFlagDef = getItemFlagDef;
  _glob.getAllItemFlagDefs = getAllItemFlagDefs;
  _glob.registerClassSheetEffects = registerClassSheetEffects;
  _glob.registerSubclassSheetEffects = registerSubclassSheetEffects;
  _glob.registerSpeciesSheetEffects = registerSpeciesSheetEffects;
  _glob.registerFeatSheetEffects = registerFeatSheetEffects;
  _glob.getClassSheetEffects = getClassSheetEffects;
  _glob.getSubclassSheetEffects = getSubclassSheetEffects;
  _glob.getSpeciesSheetEffects = getSpeciesSheetEffects;
  _glob.getFeatSheetEffects = getFeatSheetEffects;
  _glob.registerSubclassChoiceDetailDataProvider = registerSubclassChoiceDetailDataProvider;
  _glob.getSubclassChoiceDetailDataProvider = getSubclassChoiceDetailDataProvider;
  _glob.registerCantripData = registerCantripData;
  _glob.getCantripData = getCantripData;
  _glob.registerCantripDataModifier = registerCantripDataModifier;
  _glob.getCantripDataModifiers = getCantripDataModifiers;
  _glob.registerSpellData = registerSpellData;
  _glob.getSpellData = getSpellData;
  _glob.registerGlobalSpellAdapter = registerGlobalSpellAdapter;
  _glob.getGlobalSpellAdapters = getGlobalSpellAdapters;
  _glob.registerGlobalClassAdapter = registerGlobalClassAdapter;
  _glob.getGlobalClassAdapters = getGlobalClassAdapters;
  _glob.registerGlobalSubclassAdapter = registerGlobalSubclassAdapter;
  _glob.getGlobalSubclassAdapters = getGlobalSubclassAdapters;
  _glob.registerGlobalItemAdapter = registerGlobalItemAdapter;
  _glob.getGlobalItemAdapters = getGlobalItemAdapters;
  _glob.registerGlobalSpeciesAdapter = registerGlobalSpeciesAdapter;
  _glob.getGlobalSpeciesAdapters = getGlobalSpeciesAdapters;

  _glob._ARTISAN_TOOLS = _ARTISAN_TOOLS;
  _glob._MUSICAL_INSTRUMENTS = _MUSICAL_INSTRUMENTS;
  _glob._GAMING_SETS = _GAMING_SETS;
  _glob._VEHICLE_TOOLS = _VEHICLE_TOOLS;
  _glob._STD_LANGS = _STD_LANGS;
  _glob._EXOTIC_LANGS = _EXOTIC_LANGS;
  _glob._ALL_LANGS = _ALL_LANGS;
  _glob._ALL_TOOLS = _ALL_TOOLS;
}
