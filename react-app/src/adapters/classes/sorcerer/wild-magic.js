import { createAdapterBindings } from '../../adapterBindings.js';

export default function install(registry, context = {}) {
  const {
    registerSubclassAdapter,
    registerSubclassSheetActions,
    registerSubclassSheetResources,
    registerSubclassSheetEffects,
    registerResourceSideEffect,
  } = createAdapterBindings(registry, context);

registerSubclassAdapter("Sorcerer_Wild Magic", function (cls, lv, specs) {});

registerSubclassSheetActions("Sorcerer_Wild Magic", [
  {
    "name": "Wild Magic",
    "icon": "",
    "cat": "action",
    "uses": "Special",
    "minLevel": 3,
    "detailType": "wildMagic",
    "desc": "Tides of Chaos, Wild Magic Surge and related Sorcerer features. Click to expand."
  },
  {
    "name": "Bend Luck",
    "icon": "",
    "cat": "reaction",
    "uses": "1 Sorcery Point",
    "resKey": "sorc_pts",
    "minLevel": 6,
    "desc": "Reaction — immediately after another creature you can see rolls a d20 for a D20 Test: spend 1 Sorcery Point to roll 1d4 and apply the number as a bonus or penalty (your choice) to the d20 roll."
  }
]);
registerSubclassSheetResources("Sorcerer_Wild Magic", [
  {
    "key": "wild_magic",
    "name": "Wild Magic",
    "icon": "zap",
    "recharge": "LR",
    "max": () => Infinity,
    "pool": true
  },
  {
    "key": "wild_tides",
    "name": "Tides of Chaos",
    "icon": "zap",
    "recharge": "LR",
    "max": () => 1
  },
  {
    "key": "wild_tamed",
    "name": "Tamed Surge",
    "icon": "sparkles",
    "recharge": "LR",
    "max": () => 1
  }
]);

registerSubclassSheetEffects("Sorcerer_Wild Magic", [
  { type: "advantage", target: "d20", minLevel: 3, note: "Tides of Chaos." },
  { type: "rollModifier", minLevel: 6, note: "Bend Luck: add/subtract 1d4." },
  { type: "passiveNote", minLevel: 14, note: "Controlled Chaos: roll twice on Wild Magic Surge table and pick either result." },
  { type: "passiveNote", minLevel: 18, note: "Tamed Surge: pick a non-final Wild Magic Surge effect 1/LR instead of rolling." },
]);

function getSorcererLevel(C) {
  let lv = 0;
  if (String(C?.className || '').toLowerCase() === 'sorcerer') lv += C?.classLevel || C?.level || 0;
  (C?.extraClasses || []).forEach(function (ec) {
    if (String(ec?.name || '').toLowerCase() === 'sorcerer') lv += ec.level || 0;
  });
  return lv;
}

if (typeof registerResourceSideEffect === 'function') {
  registerResourceSideEffect('wild_magic', function (ctx = {}) {
    const C = ctx.character || ctx.C;
    const sorcererLevel = getSorcererLevel(C);
    if (sorcererLevel < 3) return null;
    const resources = ctx.resources || {};
    return {
      type: 'wild_magic_controller',
      sorcererLevel,
      tidesAvailable: (resources.wild_tides || 0) > 0,
      tamedAvailable: (resources.wild_tamed || 0) > 0,
      label: 'Wild Magic',
    };
  });
}
}
