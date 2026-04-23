registerSpeciesAdapter("Elf_XPHB", function (s) {
  let specs = genericSpeciesParser(s);
  if (s._versions) {
    const opts = s._versions
      .filter(function (v) { return v.name !== 'Elf' && !v.name.endsWith('; Elf'); })
      .map(function (v) {
        return { key: v.name, label: v.name.includes(';') ? v.name.split(';')[1].trim() : v.name };
      });
    specs.push({ key: 'species_version', label: 'Lineaggio Elfico', type: 'option', options: opts, count: 1, level: 1 });
  }
  specs.push({ key: 'species_spell_ability', label: 'Caratteristica da Incantatore (Elfo)', type: 'ability_choice', from: ['int', 'wis', 'cha'], count: 1, level: 1 });
  return specs;
});
