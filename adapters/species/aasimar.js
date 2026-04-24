registerSpeciesAdapter("Aasimar_XPHB", function (s) {
  let specs = genericSpeciesParser(s);
  specs = specs.filter(function (x) { return !x.key.startsWith('species_resist'); });
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
    max: () => getPB(),
  },
]);
