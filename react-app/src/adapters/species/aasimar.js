import { createAdapterBindings } from '../adapterBindings.js';

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
registerSpeciesAdapter("Aasimar_XPHB", function (s) {
  let specs = getGenericSpeciesChoiceSpecs(s);
  // Aasimar XPHB has fixed Celestial Resistance; avoid showing it as a build choice.
  // Also remove a generic size spec, if parsed from the raw JSON, so we do not show it twice.
  specs = specs.filter(function (x) {
    return !String(x.key || '').startsWith('species_resist') && x.key !== 'species_size';
  });

  specs.push({ key: 'species_size', label: 'Choose Size', type: 'generic_choice', from: ['Medium', 'Small'], count: 1, level: 1 });
  specs.push({ key: 'species_spell_ability', label: 'Spellcasting Ability (Aasimar)', type: 'ability_choice', from: ['int', 'wis', 'cha'], count: 1, level: 1 });

  const revelationOpts = [
    { key: 'Heavenly Wings',    label: 'Heavenly Wings (Flight)' },
    { key: 'Inner Radiance',    label: 'Inner Radiance (Light)' },
    { key: 'Necrotic Shroud',   label: 'Necrotic Shroud (Fear)' },
  ];
  specs.push({ key: 'species_version', label: 'Celestial Revelation (Lv.3)', type: 'option', options: revelationOpts, count: 1, level: 3 });
  return specs;
});

registerSpeciesSheetCommonChoiceMeta("Aasimar_XPHB", {
  labels: {
    species_version: 'Celestial Revelation',
    species_spell_ability: 'Spellcasting Ability (Aasimar)',
    species_size: 'Size',
  },
});
registerSpeciesSheetActions("Aasimar_XPHB", [
  {
    name: 'Celestial Revelation',
    icon: '',
    cat: 'bonus',
    uses: 'PB / LR',
    resKey: 'aasimar_revelation',
    minLevel: 3,
    desc: 'Manifest your celestial power (wings, radiance, or shroud) for 1 minute.',
  },
]);
registerSpeciesSheetResources("Aasimar_XPHB", [
  {
    key: 'aasimar_revelation',
    name: 'Celestial Revelation',
    icon: 'sparkles',
    recharge: 'LR',
    max: (lv) => Math.floor((Number(lv) - 1) / 4) + 2,
  },
]);

}

