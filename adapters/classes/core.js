import { getGlobalClassAdapters, getGlobalSubclassAdapters } from '../registry.js';

function _norm(v) {
  return String(v || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function _hdText(hd) {
  if (!hd || typeof hd !== "object") return "";
  const n = hd.number != null ? hd.number : 1;
  const f = hd.faces != null ? hd.faces : 0;
  return f ? `${n}d${f}` : "";
}

function _parseFeatureRef(ref) {
  if (typeof ref === "string") {
    const parts = ref.split("|");
    return { name: parts[0] || "", level: Number(parts[3]) || 0 };
  }
  if (ref && typeof ref === "object") {
    return {
      name:  String(ref.name  || ref.classFeature || ""),
      level: Number(ref.level || 0),
    };
  }
  return null;
}

function _normalizeFeatureRefs(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(_parseFeatureRef)
    .filter(function (r) { return r && r.name; });
}

function _classNormalizeRecord(rawClass, ctx) {
  const raw  = rawClass && typeof rawClass === "object" ? rawClass : {};
  const name = String(raw.name   || "").trim();
  const src  = String(raw.source || (ctx && ctx.defaultSource) || "").trim();

  const cls  = Object.assign({}, raw);
  cls.name   = name   || "Unknown Class";
  cls.source = src;
  cls.hdText = _hdText(raw.hd);
  cls.spellcastingAbility = raw.spellcastingAbility
    ? String(raw.spellcastingAbility).toLowerCase()
    : null;

  cls.savingThrowProfs = Array.isArray(raw.proficiency)
    ? raw.proficiency.map(function (p) { return String(p || "").toLowerCase(); })
    : [];

  cls._featureRefs = _normalizeFeatureRefs(raw.classFeatures);

  cls._meta = Object.assign(
    {},
    raw._meta && typeof raw._meta === "object" ? raw._meta : {},
    {
      classKey:  _norm(name) + "_" + _norm(src),
      isAdapted: true,
    }
  );

  return cls;
}

function _subclassNormalizeRecord(rawSub, ctx) {
  const raw       = rawSub && typeof rawSub === "object" ? rawSub : {};
  const name      = String(raw.name        || "").trim();
  const src       = String(raw.source      || (ctx && ctx.defaultSource) || "").trim();
  const className = String(raw.className   || "").trim();
  const shortName = String(raw.shortName   || raw.name || "").trim();

  const sub       = Object.assign({}, raw);
  sub.name        = name      || "Unknown Subclass";
  sub.source      = src;
  sub.className   = className;
  sub.shortName   = shortName;

  sub._featureRefs = _normalizeFeatureRefs(raw.subclassFeatures);

  sub._meta = Object.assign(
    {},
    raw._meta && typeof raw._meta === "object" ? raw._meta : {},
    {
      subclassKey: _norm(className) + "_" + _norm(shortName) + "_" + _norm(src),
      isAdapted:   true,
    }
  );

  return sub;
}

function _runGlobalAdapters(record, fnGet, label, ctx) {
  var list = fnGet();
  if (!Array.isArray(list)) return record;
  return list.reduce(function (acc, fn) {
    if (typeof fn !== "function") return acc;
    try {
      var next = fn(acc, ctx);
      return next && typeof next === "object" ? next : acc;
    } catch (err) {
      console.warn("[" + label + "] global adapter error for", acc && acc.name, err);
      return acc;
    }
  }, record && typeof record === "object" ? Object.assign({}, record) : record);
}

export function adaptClassRecord(rawClass, ctx) {
  return _runGlobalAdapters(
    _classNormalizeRecord(rawClass, ctx),
    getGlobalClassAdapters,
    "ClassAdapter",
    ctx
  );
}

export function adaptSubclassRecord(rawSub, ctx) {
  return _runGlobalAdapters(
    _subclassNormalizeRecord(rawSub, ctx),
    getGlobalSubclassAdapters,
    "SubclassAdapter",
    ctx
  );
}

export function adaptClassesDataset(rawClasses, ctx) {
  if (!Array.isArray(rawClasses)) return [];
  return rawClasses.map(function (c) { return adaptClassRecord(c, ctx); });
}

export function adaptSubclassesDataset(rawSubs, ctx) {
  if (!Array.isArray(rawSubs)) return [];
  return rawSubs.map(function (s) { return adaptSubclassRecord(s, ctx); });
}

const _glob = typeof window !== 'undefined' ? window : null;
if (_glob) {
  _glob.adaptClassRecord       = adaptClassRecord;
  _glob.adaptSubclassRecord    = adaptSubclassRecord;
  _glob.adaptClassesDataset    = adaptClassesDataset;
  _glob.adaptSubclassesDataset = adaptSubclassesDataset;
}
