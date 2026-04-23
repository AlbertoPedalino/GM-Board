registerSpeciesAdapter("Aasimar_XPHB", function (s) {
  let specs = genericSpeciesParser(s);
  specs = specs.filter(function (x) { return !x.key.startsWith('species_resist'); });
  // Taglia: Medium o Small
  specs.push({ key: 'species_size', label: 'Scegli Taglia', type: 'generic_choice', from: ['Media', 'Piccola'], count: 1, level: 1 });
  specs.push({ key: 'species_spell_ability', label: 'Caratteristica da Incantatore (Aasimar)', type: 'ability_choice', from: ['int', 'wis', 'cha'], count: 1, level: 1 });
  // Celestial Revelation: scelta permanente al livello 3 del personaggio
  const revelationOpts = [
    { key: 'Heavenly Wings',    label: 'Ali Celestiali (Volo)' },
    { key: 'Inner Radiance',    label: 'Radianza Interiore (Luce)' },
    { key: 'Necrotic Shroud',   label: 'Sudario Necrotico (Paura)' },
  ];
  specs.push({ key: 'species_version', label: 'Rivelazione Celestiale (Lv.3)', type: 'option', options: revelationOpts, count: 1, level: 3 });
  return specs;
});
