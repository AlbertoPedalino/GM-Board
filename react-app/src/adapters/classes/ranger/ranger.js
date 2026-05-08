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
registerClassAdapter("Ranger", function (cls, lv, specs) {
  if (lv >= 1) {
    const weapons = typeof allItemsDb !== 'undefined'
      ? allItemsDb
          .filter(function (i) { return (i.type === 'M' || i.type === 'R') && (!i.rarity || i.rarity === 'none'); })
          .map(function (i) { return i.name; })
      : [];
    specs.push({
      key: 'ranger_weapon_mastery_1',
      label: 'Weapon Mastery 1',
      type: 'generic_choice',
      from: weapons,
      count: 1,
      level: 1
    });
    specs.push({
      key: 'ranger_weapon_mastery_2',
      label: 'Weapon Mastery 2',
      type: 'generic_choice',
      from: weapons,
      count: 1,
      level: 1
    });
  }
  if (lv >= 2) {
    specs.push({
      key: 'ranger_expertise_1',
      label: 'Expertise 1 (Ranger)',
      type: 'expertise',
      from: [],
      count: 1,
      level: 2
    });
    specs.push({
      key: 'ranger_fighting_style',
      label: 'Fighting Style',
      type: 'feat_cat',
      categories: ['FS', 'FS:R'],
      count: 1,
      level: 2
    });
  }
  if (lv >= 9) {
    specs.push({
      key: 'ranger_expertise_2',
      label: 'Expertise 2 (Ranger)',
      type: 'expertise',
      from: [],
      count: 1,
      level: 9
    });
    specs.push({
      key: 'ranger_expertise_3',
      label: 'Expertise 3 (Ranger)',
      type: 'expertise',
      from: [],
      count: 1,
      level: 9
    });
  }
  if (lv >= 19) {
    specs.push({ key: 'ranger_epic_boon', label: 'Epic Boon', type: 'feat_cat', categories: ['EB'], count: 1, level: 19 });
  }
});

// [SheetRuntime] START
registerClassSheetActions("Ranger", [
  {
    "name": "Favored Enemy",
    "icon": "",
    "cat": "bonus",
    "uses": "Passive",
    "desc": "You always have Hunter's Mark prepared (doesn't count against spells known). You can cast it without expending a spell slot: 2 free casts per LR at lv.1, scaling to 3 (lv.5), 4 (lv.9), 5 (lv.13), 6 (lv.17)."
  },
  {
    "name": "Hunter's Mark",
    "icon": "",
    "cat": "bonus",
    "uses": "2 free / LR",
    "resKey": "hunters_mark_free",
    "damageFormula": "1d6",
    "damageButtonLabel": "+1d6",
    "desc": "Bonus Action (Concentration): mark a creature you can see within 90 ft. +1d6 damage on every hit against it. Advantage on PER/Survival checks to find it. Move the mark (Bonus Action) when the marked creature dies. At lv.17: no longer requires Concentration."
  },
  {
    "name": "Deft Explorer",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 2,
    "desc": "Expertise in one skill. Learn two languages."
  },
  {
    "name": "Roving",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 6,
    "desc": "Your Speed increases by 10 ft. You gain Climb Speed and Swim Speed equal to your Speed."
  },
  {
    "name": "Extra Attack",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 5,
    "desc": "Attack twice when you take the Attack action."
  },
  {
    "name": "Tireless",
    "icon": "",
    "cat": "action",
    "uses": "WIS mod / LR",
    "resKey": "ranger_tireless",
    "minLevel": 10,
    "desc": "Magic action: gain 1d8 + WIS modifier Temporary HP. When you finish a Short Rest, your Exhaustion level is reduced by 1. Uses per Long Rest = WIS modifier."
  },
  {
    "name": "Relentless Hunter",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 13,
    "desc": "Taking damage can't break your Concentration on Hunter's Mark."
  },
  {
    "name": "Nature's Veil",
    "icon": "",
    "cat": "bonus",
    "uses": "WIS mod / LR",
    "resKey": "natures_veil",
    "minLevel": 14,
    "desc": "Bonus Action: become Invisible until the end of your next turn. Uses per Long Rest = WIS modifier."
  },
  {
    "name": "Precise Hunter",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 17,
    "desc": "You have Advantage on attack rolls against the creature currently marked by your Hunter's Mark."
  },
  {
    "name": "Feral Senses",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 18,
    "desc": "You gain Blindsight 30 ft."
  },
  {
    "name": "Foe Slayer",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 20,
    "desc": "The extra damage die from Hunter's Mark increases to 1d10 (instead of 1d6)."
  }
]);
registerClassSheetResources("Ranger", [
  {
    "key": "hunters_mark_free",
    "name": "Hunter's Mark (free)",
    "icon": "crosshair",
    "recharge": "LR",
    "max": (lv) => lv >= 17 ? 6 : lv >= 13 ? 5 : lv >= 9 ? 4 : lv >= 5 ? 3 : 2
  },
  {
    "key": "ranger_tireless",
    "name": "Tireless",
    "icon": "heart",
    "recharge": "LR",
    "minLevel": 10,
    "max": () => typeof getMod === 'function' && typeof getFinal === 'function' ? Math.max(1, getMod(getFinal('wis'))) : 1
  },
  {
    "key": "natures_veil",
    "name": "Nature's Veil",
    "icon": "eye-off",
    "recharge": "LR",
    "minLevel": 14,
    "max": () => typeof getMod === 'function' && typeof getFinal === 'function' ? Math.max(1, getMod(getFinal('wis'))) : 1
  }
]);
// [SheetRuntime] END

}

