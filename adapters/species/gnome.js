// Gnome XPHB: Gnomish Lineage — scelta tra 3 varianti
registerSpeciesAdapter("Gnome_XPHB", function (s) {
  let specs = genericSpeciesParser(s);
  const lineageOpts = [
    { key: 'Forest Gnome',  label: 'Forest Gnome (Minor Illusion + Speak with Animals)' },
    { key: 'Rock Gnome',    label: 'Rock Gnome (Mending + Tinker)' },
    { key: 'Deep Gnome',    label: 'Deep Gnome (Disguise Self + Darkvision 120 ft)' },
  ];
  specs.push({ key: 'species_version', label: 'Gnomish Lineage', type: 'option', options: lineageOpts, count: 1, level: 1 });
  specs.push({ key: 'species_spell_ability', label: 'Spellcasting Ability (Gnome)', type: 'ability_choice', from: ['int', 'wis', 'cha'], count: 1, level: 1 });
  return specs;
});
