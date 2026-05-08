import { createAdapterBindings } from '../../adapterBindings.js';

export default function install(registry, context = {}) {
  const {
    SKILLS,
    _ARTISAN_TOOLS,
    _MUSICAL_INSTRUMENTS,
    _GAMING_SETS,
    _VEHICLE_TOOLS,
    _STD_LANGS,
    _EXOTIC_LANGS,
    _ALL_LANGS,
    _ALL_TOOLS,
    allItemsDb,
    registerClassAdapter,
    getClassAdapter,
    registerSubclassAdapter,
    getSubclassAdapter,
    registerSpeciesAdapter,
    getSpeciesAdapter,
    registerFeatAdapter,
    getFeatAdapter,
    registerClassSheetActions,
    getClassSheetActions,
    registerSubclassSheetActions,
    getSubclassSheetActions,
    registerSpeciesSheetActions,
    getSpeciesSheetActions,
    registerFeatSheetActions,
    getFeatSheetActions,
    registerClassSheetResources,
    getClassSheetResources,
    registerSubclassSheetResources,
    getSubclassSheetResources,
    registerSpeciesSheetResources,
    getSpeciesSheetResources,
    registerFeatSheetResources,
    getFeatSheetResources,
    registerClassSheetEffects,
    getClassSheetEffects,
    registerSubclassSheetEffects,
    getSubclassSheetEffects,
    registerSpeciesSheetEffects,
    getSpeciesSheetEffects,
    registerFeatSheetEffects,
    getFeatSheetEffects,
    registerClassRuntimeConfig,
    getClassRuntimeConfig,
    registerSubclassRuntimeConfig,
    getSubclassRuntimeConfig,
    registerSpeciesRuntimeConfig,
    getSpeciesRuntimeConfig,
    registerClassSheetChoiceMeta,
    getClassSheetChoiceMeta,
    registerSubclassSheetChoiceMeta,
    getSubclassSheetChoiceMeta,
    registerSpeciesSheetChoiceMeta,
    getSpeciesSheetChoiceMeta,
    registerClassSheetCommonChoiceMeta,
    registerSubclassSheetCommonChoiceMeta,
    registerSpeciesSheetCommonChoiceMeta,
    registerItemFlagDef,
    getItemFlagDef,
    getAllItemFlagDefs,
    registerWeaponAbilityOverride,
    getWeaponAbilityOverrides,
    registerClassSheetFeatureFilter,
    getClassSheetFeatureFilters,
    registerSubclassSheetFeatureFilter,
    getSubclassSheetFeatureFilters,
    registerSpeciesSheetFeatureFilter,
    getSpeciesSheetFeatureFilters,
    registerClassSheetProficiencies,
    getClassSheetProficiencies,
    registerSubclassSheetProficiencies,
    getSubclassSheetProficiencies,
    registerSpeciesSheetProficiencies,
    getSpeciesSheetProficiencies,
    registerClassSheetSpellModifiers,
    getClassSheetSpellModifiers,
    registerSubclassSheetSpellModifiers,
    getSubclassSheetSpellModifiers,
    registerSpeciesSheetSpellModifiers,
    getSpeciesSheetSpellModifiers,
    registerClassChoiceKeyFilter,
    getClassChoiceKeyFilter,
    registerClassChoiceLabelProvider,
    getClassChoiceLabelProvider,
    registerSpeciesSheetHpBonus,
    getSpeciesSheetHpBonus,
    registerClassAtWillSpells,
    getClassAtWillSpells,
    registerSpeciesLongRestGrants,
    getSpeciesLongRestGrants,
    registerResourceSideEffect,
    getResourceSideEffect,
    registerSubclassChoiceDetailDataProvider,
    getSubclassChoiceDetailDataProvider,
    registerGlobalClassAdapter,
    getGlobalClassAdapters,
    registerGlobalSubclassAdapter,
    getGlobalSubclassAdapters,
    registerGlobalSpeciesAdapter,
    getGlobalSpeciesAdapters,
    registerGlobalFeatAdapter,
    getGlobalFeatAdapters,
    registerGlobalSpellAdapter,
    getGlobalSpellAdapters,
    registerGlobalItemAdapter,
    getGlobalItemAdapters,
    registerCantripData,
    getCantripData,
    registerCantripDataModifier,
    getCantripDataModifiers,
    registerSpellData,
    getSpellData,
    getGenericSpeciesChoiceSpecs,
    getGenericBackgroundChoiceSpecs,
    getGenericBackgroundChoiceMeta,
    getGenericBackgroundOriginFeat,
  } = createAdapterBindings(registry, context);
registerClassAdapter("Cleric", function (cls, lv, specs) {
  if (lv >= 1) {
    specs.push({
      key: 'cleric_divine_order',
      label: 'Divine Order',
      type: 'generic_choice',
      from: ['Protector', 'Thaumaturge'],
      count: 1,
      level: 1
    });
    var _divOrder = typeof char !== 'undefined' && char.choices && char.choices.cleric_divine_order;
    if (Array.isArray(_divOrder) ? _divOrder.includes('Thaumaturge') : _divOrder === 'Thaumaturge') {
      specs.push({
        key: 'cleric_thaumaturge_cantrip',
        label: 'Thaumaturge — Extra Cantrip',
        type: 'spell_choice',
        spellFilter: { spellLevel: 0, classes: ['Cleric'] },
        count: 1,
        level: 1
      });
    }
  }
  if (lv >= 7) {
    specs.push({
      key: 'cleric_blessed_strikes',
      label: 'Blessed Strikes',
      type: 'generic_choice',
      from: ['Divine Strike', 'Potent Spellcasting'],
      count: 1,
      level: 7
    });
  }
  if (lv >= 19) {
    specs.push({
      key: 'cleric_epic_boon',
      label: 'Epic Boon',
      type: 'feat_cat',
      categories: ['EB'],
      count: 1,
      level: 19
    });
  }
});

// [SheetRuntime] START
registerClassSheetProficiencies("Cleric", [
  { type: "armor",  values: ["Heavy"],   minLevel: 1, requiredChoice: { key: "cleric_divine_order", value: "Protector" } },
  { type: "weapon", values: ["Martial"], minLevel: 1, requiredChoice: { key: "cleric_divine_order", value: "Protector" } }
]);
registerClassSheetActions("Cleric", [
  {
    "name": "Divine Order",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "desc": "Choose at lv.1 — Protector: proficiency with Martial weapons and Heavy armor; or Thaumaturge: learn one extra Cleric cantrip and gain a bonus equal to your WIS modifier (min +1) to Intelligence (Arcana or Religion) checks."
  },
  {
    "name": "Channel Divinity",
    "icon": "",
    "cat": "action",
    "uses": "2-4 / SR",
    "resKey": "channel_div",
    "minLevel": 2,
    "desc": "Channel your deity's power. Uses: 2 (lv.2–5), 3 (lv.6–17), 4 (lv.18+). Recharge: Short Rest. Options include Turn Undead and your Domain's feature (see subclass)."
  },
  {
    "name": "Turn Undead",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel",
    "resKey": "channel_div",
    "minLevel": 2,
    "desc": "Channel Divinity option. Each Undead within 30 ft that can see or hear you must succeed on a WIS save (DC = 8+PB+WIS) or have the Frightened and Incapacitated condition for 1 minute and must flee."
  },
  {
    "name": "Divine Spark",
    "icon": "",
    "cat": "action",
    "uses": "1+ Channel",
    "resKey": "channel_div",
    "minLevel": 2,
    "healFormula": ({ character, ownerLevel }) => {
      const wis = typeof getMod === "function" && typeof getFinal === "function"
        ? Number(getMod(getFinal("wis")) || 0)
        : 0;
      const lv = Number(ownerLevel || 1);
      const dice = lv >= 18 ? 4 : lv >= 13 ? 3 : lv >= 7 ? 2 : 1;
      return `${dice}d8${wis >= 0 ? "+" : ""}${wis}`;
    },
    "damageKind": "heal",
    "damageButtonLabel": ({ formula }) => String(formula || ""),
    "rollLabelPrefix": "Divine Spark",
    "desc": "Channel Divinity option. Choose a creature within 30 ft: it either regains HP or takes Radiant or Necrotic damage (your choice) equal to 1d8 + WIS modifier (scales by level: 2d8 at lv.7, 3d8 at lv.13, 4d8 at lv.18)."
  },
  {
    "name": "Sear Undead",
    "icon": "",
    "cat": "action",
    "uses": "On Turn Undead",
    "minLevel": 5,
    "damageFormula": () => {
      const wis = typeof getMod === 'function' && typeof getFinal === 'function'
        ? Number(getMod(getFinal('wis')) || 1)
        : 1;
      return `${Math.max(1, wis)}d8`;
    },
    "damageButtonLabel": ({ formula }) => `${formula} radiant`,
    "damageKind": "damage",
    "desc": "When you use Turn Undead, each Undead that fails its WIS save also takes Radiant damage equal to a number of d8s equal to your WIS modifier (minimum 1d8). This damage doesn't end the turn effect."
  },
  {
    "name": "Divine Intervention",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "divine_intervention",
    "minLevel": 10,
    "desc": "Choose any Cleric spell of level 5 or lower that doesn't require a Reaction. Cast it without expending a spell slot or needing Material components. Recharge: Long Rest."
  },
  {
    "name": "Blessed Strikes",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 7,
    "damageFormula": "1d8",
    "damageButtonLabel": "+1d8 divine",
    "desc": "Gain one of two benefits: Divine Strike (add 1d8 of your domain's damage type once per turn) or Potent Spellcasting (add WIS mod to Cleric cantrip damage)."
  },
  {
    "name": "Improved Blessed Strikes",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 14,
    "desc": "Your Blessed Strikes choice is upgraded — Divine Strike: extra damage increases to 2d8; Potent Spellcasting: when you deal damage with a Cleric cantrip, you also grant Temporary HP equal to twice your WIS modifier to yourself or one creature within 60 ft."
  },
  {
    "name": "Greater Divine Intervention",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "divine_intervention",
    "minLevel": 20,
    "desc": "Your Divine Intervention can now target a Wish spell. If you cast Wish this way, you can't use Divine Intervention again until you finish 2d4 Long Rests. Otherwise functions as Divine Intervention (cast any Cleric spell ≤lv5, no slot or material component). Recharge: Long Rest."
  }
]);
registerClassSheetResources("Cleric", [
  {
    "key": "channel_div",
    "name": "Channel Divinity",
    "icon": "sun",
    "recharge": "SR",
    "max": (lv)=>lv>=18?4:lv>=6?3:2
  },
  {
    "key": "divine_intervention",
    "name": "Divine Intervention",
    "icon": "hands",
    "recharge": "LR",
    "max": (lv)=>lv>=10?1:0
  }
]);
// [SheetRuntime] END

}

