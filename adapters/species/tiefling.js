registerSpeciesAdapter("Tiefling_XPHB", function (s) {
  let specs = getGenericSpeciesChoiceSpecs(s);
  specs = specs.filter(function (x) { return !x.key.startsWith('species_resist'); });
  if (s._versions) {
    const opts = s._versions.map(function (v) {
      return { key: v.name, label: v.name.includes(';') ? v.name.split(';')[1].trim() : v.name };
    });
    specs.push({ key: 'species_version', label: 'Infernal Legacy', type: 'option', options: opts, count: 1, level: 1 });
  }
  specs.push({ key: 'species_spell_ability', label: 'Spellcasting Ability (Tiefling)', type: 'ability_choice', from: ['int', 'wis', 'cha'], count: 1, level: 1 });
  return specs;
});

registerSpeciesSheetCommonChoiceMeta("Tiefling_XPHB", {
  labels: {
    species_version: 'Infernal Legacy',
    species_spell_ability: 'Spellcasting Ability (Tiefling)',
  },
});
