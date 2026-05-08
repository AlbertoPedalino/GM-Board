import { getGlobalItemAdapters } from '../registry.js';

const WEAPON_TYPES = new Set(["M", "R"]);
const ARMOR_TYPES  = new Set(["LA", "MA", "HA"]);
const AMMO_TYPES   = new Set(["A", "AF", "AT"]);

function _norm(v) {
  return String(v || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function _resolveType(raw) {
  var type = raw.type ? String(raw.type).split("|")[0] : null;
  if (!type || type === "G" || type === "OTH") {
    if (raw.weapon)      type = "M";
    else if (raw.ammo)   type = "A";
    else if (raw.armor)  type = "MA";
    else if (raw.shield) type = "S";
    else                 type = "OTH";
  }
  return type;
}

function _itemNormalizeRecord(rawItem, ctx) {
  var raw  = rawItem && typeof rawItem === "object" ? rawItem : {};
  var name = String(raw.name   || "").trim();
  var src  = String(raw.source || (ctx && ctx.defaultSource) || "").trim();
  var type = _resolveType(raw);

  var item  = Object.assign({}, raw);
  item.name   = name || "Unknown Item";
  item.source = src;
  item.type   = type;

  if (!Array.isArray(item.property)) {
    item.property = item.property ? [item.property] : [];
  }
  item.property = item.property.map(function(p) { return String(p).split("|")[0]; });

  if (item.dmgType) item.dmgType = String(item.dmgType).toLowerCase();

  if (raw.mastery) {
    var m = Array.isArray(raw.mastery) ? raw.mastery[0] : raw.mastery;
    item.mastery = String(m || "").split("|")[0].trim();
  } else {
    item.mastery = null;
  }

  item._meta = Object.assign(
    {},
    raw._meta && typeof raw._meta === "object" ? raw._meta : {},
    {
      itemKey:        _norm(name) + "_" + _norm(src),
      isWeapon:       WEAPON_TYPES.has(type),
      isMeleeWeapon:  type === "M",
      isRangedWeapon: type === "R",
      isArmor:        ARMOR_TYPES.has(type),
      isShield:       type === "S",
      isAmmo:         AMMO_TYPES.has(type),
      isMagic:        !!(raw.rarity && raw.rarity !== "none"),
      isVariant:      !!raw._variant,
      isAdapted:      true,
    }
  );

  return item;
}

function _runGlobalAdapters(item, ctx) {
  var list = getGlobalItemAdapters();
  if (!Array.isArray(list)) return item;
  return list.reduce(function (acc, fn) {
    if (typeof fn !== "function") return acc;
    try {
      var next = fn(acc, ctx);
      return next && typeof next === "object" ? next : acc;
    } catch (err) {
      console.warn("[ItemAdapter] global adapter error for", acc && acc.name, err);
      return acc;
    }
  }, item && typeof item === "object" ? Object.assign({}, item) : item);
}

export function adaptItemRecord(rawItem, ctx) {
  return _runGlobalAdapters(_itemNormalizeRecord(rawItem, ctx), ctx);
}

export function adaptItemsDataset(rawItems, ctx) {
  if (!Array.isArray(rawItems)) return [];
  return rawItems.map(function (i) { return adaptItemRecord(i, ctx); });
}

const _glob = typeof window !== 'undefined' ? window : null;
if (_glob) {
  _glob.adaptItemRecord   = adaptItemRecord;
  _glob.adaptItemsDataset = adaptItemsDataset;
}
