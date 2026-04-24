registerSpeciesAdapter("Elf_XPHB", function (s) {
  let specs = genericSpeciesParser(s);
  if (s._versions) {
    const opts = s._versions
      .filter(function (v) { return v.name !== 'Elf' && !v.name.endsWith('; Elf'); })
      .map(function (v) {
        return { key: v.name, label: v.name.includes(';') ? v.name.split(';')[1].trim() : v.name };
      });
    specs.push({ key: 'species_version', label: 'Elven Lineage', type: 'option', options: opts, count: 1, level: 1 });
  }
  specs.push({ key: 'species_spell_ability', label: 'Spellcasting Ability (Elf)', type: 'ability_choice', from: ['int', 'wis', 'cha'], count: 1, level: 1 });
  return specs;
});

registerSpeciesSheetCommonChoiceMeta("Elf_XPHB", {
  labels: {
    species_version: 'Elven Lineage',
    species_spell_ability: 'Spellcasting Ability (Elf)',
  },
});
