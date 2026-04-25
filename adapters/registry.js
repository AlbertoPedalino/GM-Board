/**
 * adapters/registry.js
 * Dizionari globali + registrazione/lookup adapter con chiavi canoniche.
 * Caricato prima di manifest.js e loader.js.
 */

const ClassAdapters    = {};
const SubclassAdapters = {};
const SpeciesAdapters  = {};

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

function _normAdapterKey(v) {
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
  const out = { ...action };
  const text = `${String(out.name || "")} ${String(out.desc || "")}`.toLowerCase();

  const hasAttackMeta =
    out.attackRoll !== undefined ||
    out.attackAbility !== undefined ||
    out.attackBonus !== undefined;
  if (!hasAttackMeta) {
    if (/\bspell\b|\bcantrip\b|\bmagic\b/.test(text)) out.attackRoll = "spell";
    else if (/\branged\b/.test(text)) out.attackAbility = "dex";
    else if (/\bmelee\b|\bunarmed\b|\bweapon attack\b/.test(text)) out.attackAbility = "str";
  }

  const hasDamageMeta =
    out.damageFormula !== undefined ||
    out.rollDamage !== undefined ||
    out.damage !== undefined ||
    out.damageRolls !== undefined;
  if (!hasDamageMeta) {
    const auto = _sheetActionBuildAutoDamageFormula(out.desc || "");
    if (auto) out.damageFormula = auto;
  }
  return out;
}
function _sheetActionsPrepare(actions) {
  return (Array.isArray(actions) ? actions : []).map(_sheetActionEnrichRollMeta);
}

function registerClassAdapter(name, fn) {
  _setStoreValue(ClassAdapters, name, _toClassCanonicalKey(name), fn);
}
function registerSubclassAdapter(key, fn) {
  _setStoreValue(SubclassAdapters, key, _toSubclassCanonicalKeyFromRaw(key), fn);
}
function registerSpeciesAdapter(key, fn) {
  _setStoreValue(SpeciesAdapters, key, _toSpeciesCanonicalKeyFromRaw(key), fn);
}

function registerClassSheetActions(name, actions) {
  _setStoreValue(
    ClassSheetActions,
    name,
    _toClassCanonicalKey(name),
    _sheetActionsPrepare(actions)
  );
}
function registerSubclassSheetActions(key, actions) {
  _setStoreValue(
    SubclassSheetActions,
    key,
    _toSubclassCanonicalKeyFromRaw(key),
    _sheetActionsPrepare(actions)
  );
}

function registerClassSheetResources(name, resources) {
  _setStoreValue(
    ClassSheetResources,
    name,
    _toClassCanonicalKey(name),
    Array.isArray(resources) ? resources : []
  );
}
function registerSubclassSheetResources(key, resources) {
  _setStoreValue(
    SubclassSheetResources,
    key,
    _toSubclassCanonicalKeyFromRaw(key),
    Array.isArray(resources) ? resources : []
  );
}
function registerClassSheetProficiencies(name, grants) {
  _setStoreValue(
    ClassSheetProficiencies,
    name,
    _toClassCanonicalKey(name),
    Array.isArray(grants) ? grants : []
  );
}
function registerSubclassSheetProficiencies(key, grants) {
  _setStoreValue(
    SubclassSheetProficiencies,
    key,
    _toSubclassCanonicalKeyFromRaw(key),
    Array.isArray(grants) ? grants : []
  );
}
function registerSpeciesSheetProficiencies(key, grants) {
  _setStoreValue(
    SpeciesSheetProficiencies,
    key,
    _toSpeciesCanonicalKeyFromRaw(key),
    Array.isArray(grants) ? grants : []
  );
}

function registerClassSheetFeatureFilter(name, fn) {
  _pushSheetFilter(ClassSheetFeatureFilters, name, _toClassCanonicalKey(name), fn);
}
function registerSubclassSheetFeatureFilter(key, fn) {
  _pushSheetFilter(SubclassSheetFeatureFilters, key, _toSubclassCanonicalKeyFromRaw(key), fn);
}

function registerClassSheetChoiceMeta(name, meta) {
  _setMetaValue(ClassSheetChoiceMeta, name, _toClassCanonicalKey(name), meta);
}
function registerSubclassSheetChoiceMeta(key, meta) {
  _setMetaValue(SubclassSheetChoiceMeta, key, _toSubclassCanonicalKeyFromRaw(key), meta);
}

function registerSpeciesSheetActions(key, actions) {
  _setStoreValue(
    SpeciesSheetActions,
    key,
    _toSpeciesCanonicalKeyFromRaw(key),
    _sheetActionsPrepare(actions)
  );
}

function registerSpeciesSheetResources(key, resources) {
  _setStoreValue(
    SpeciesSheetResources,
    key,
    _toSpeciesCanonicalKeyFromRaw(key),
    Array.isArray(resources) ? resources : []
  );
}

function registerSpeciesSheetFeatureFilter(key, fn) {
  _pushSheetFilter(SpeciesSheetFeatureFilters, key, _toSpeciesCanonicalKeyFromRaw(key), fn);
}

function registerSpeciesSheetChoiceMeta(key, meta) {
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
function registerClassSheetCommonChoiceMeta(name, extraMeta) {
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
      return _defaultChoiceLabel(choiceKey, /^(start_|feat_|class_|subclass_|auto_(primary|ec\d+)_feat_)/);
    },
    normalizeChoiceValue: _defaultChoiceNormalize,
    ...(extraMeta && typeof extraMeta === "object" ? extraMeta : {}),
  });
}
function registerSubclassSheetCommonChoiceMeta(key, extraMeta) {
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

function registerSpeciesSheetCommonChoiceMeta(key, extraMeta) {
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
      return _defaultChoiceLabel(k, /^species_/);
    },
    normalizeChoiceValue: _defaultChoiceNormalize,
    ...(extraMeta && typeof extraMeta === "object" ? extraMeta : {}),
  });
}

function getClassAdapter(name) {
  return _getStoreValue(ClassAdapters, name, _toClassCanonicalKey(name));
}
function getSubclassAdapter(className, subclassShortName) {
  const raw = className && subclassShortName ? `${className}_${subclassShortName}` : "";
  return _getStoreValue(SubclassAdapters, raw, _toSubclassCanonicalKey(className, subclassShortName));
}
function getSpeciesAdapter(speciesName, speciesSource) {
  const raw = speciesName && speciesSource ? `${speciesName}_${speciesSource}` : "";
  return _getStoreValue(SpeciesAdapters, raw, _toSpeciesCanonicalKey(speciesName, speciesSource));
}

function getClassSheetActions(name) {
  return _getStoreValue(ClassSheetActions, name, _toClassCanonicalKey(name)) || [];
}
function getSubclassSheetActions(className, subclassShortName) {
  const raw = className && subclassShortName ? `${className}_${subclassShortName}` : "";
  return _getStoreValue(SubclassSheetActions, raw, _toSubclassCanonicalKey(className, subclassShortName)) || [];
}
function getClassSheetResources(name) {
  return _getStoreValue(ClassSheetResources, name, _toClassCanonicalKey(name)) || [];
}
function getSubclassSheetResources(className, subclassShortName) {
  const raw = className && subclassShortName ? `${className}_${subclassShortName}` : "";
  return _getStoreValue(SubclassSheetResources, raw, _toSubclassCanonicalKey(className, subclassShortName)) || [];
}
function getClassSheetFeatureFilters(name) {
  return _getStoreValue(ClassSheetFeatureFilters, name, _toClassCanonicalKey(name)) || [];
}
function getSubclassSheetFeatureFilters(className, subclassShortName) {
  const raw = className && subclassShortName ? `${className}_${subclassShortName}` : "";
  return _getStoreValue(SubclassSheetFeatureFilters, raw, _toSubclassCanonicalKey(className, subclassShortName)) || [];
}
function getClassSheetChoiceMeta(name) {
  return _getStoreValue(ClassSheetChoiceMeta, name, _toClassCanonicalKey(name)) || {};
}
function getSubclassSheetChoiceMeta(className, subclassShortName) {
  const raw = className && subclassShortName ? `${className}_${subclassShortName}` : "";
  return _getStoreValue(SubclassSheetChoiceMeta, raw, _toSubclassCanonicalKey(className, subclassShortName)) || {};
}

function getSpeciesSheetActions(speciesName, speciesSource) {
  const raw = speciesName && speciesSource ? `${speciesName}_${speciesSource}` : "";
  return _getStoreValue(SpeciesSheetActions, raw, _toSpeciesCanonicalKey(speciesName, speciesSource)) || [];
}
function getSpeciesSheetResources(speciesName, speciesSource) {
  const raw = speciesName && speciesSource ? `${speciesName}_${speciesSource}` : "";
  return _getStoreValue(SpeciesSheetResources, raw, _toSpeciesCanonicalKey(speciesName, speciesSource)) || [];
}
function getSpeciesSheetFeatureFilters(speciesName, speciesSource) {
  const raw = speciesName && speciesSource ? `${speciesName}_${speciesSource}` : "";
  return _getStoreValue(SpeciesSheetFeatureFilters, raw, _toSpeciesCanonicalKey(speciesName, speciesSource)) || [];
}
function getSpeciesSheetChoiceMeta(speciesName, speciesSource) {
  const raw = speciesName && speciesSource ? `${speciesName}_${speciesSource}` : "";
  return _getStoreValue(SpeciesSheetChoiceMeta, raw, _toSpeciesCanonicalKey(speciesName, speciesSource)) || {};
}
function getClassSheetProficiencies(name) {
  return _getStoreValue(ClassSheetProficiencies, name, _toClassCanonicalKey(name)) || [];
}
function getSubclassSheetProficiencies(className, subclassShortName) {
  const raw = className && subclassShortName ? `${className}_${subclassShortName}` : "";
  return _getStoreValue(SubclassSheetProficiencies, raw, _toSubclassCanonicalKey(className, subclassShortName)) || [];
}
function getSpeciesSheetProficiencies(speciesName, speciesSource) {
  const raw = speciesName && speciesSource ? `${speciesName}_${speciesSource}` : "";
  return _getStoreValue(SpeciesSheetProficiencies, raw, _toSpeciesCanonicalKey(speciesName, speciesSource)) || [];
}

// Utility: rimuove tag 5etools ({@skill Foo|XPHB} -> "Foo")
function _cleanTagName(str) {
  if (typeof str !== "string") return str;
  return str.split("|")[0].replace(/\{@\w+ /g, "").replace(/\}/g, "");
}
