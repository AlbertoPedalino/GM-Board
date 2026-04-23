// Goliath XPHB: Giant Ancestry — scelta del tipo di gigante (determina resistenza e abilità)
registerSpeciesAdapter("Goliath_XPHB", function (s) {
  let specs = genericSpeciesParser(s);
  const ancestryOpts = [
    { key: "Cloud's Jaunt",    label: "Cloud Giant — Teletrasporto (Intelligence)" },
    { key: "Fire's Burn",      label: "Fire Giant — Danno Fuoco Bonus (Strength)" },
    { key: "Frost's Chill",    label: "Frost Giant — Danno Freddo + Rallentamento (Constitution)" },
    { key: "Hill's Tumble",    label: "Hill Giant — Atterramento (Strength)" },
    { key: "Stone's Endurance",label: "Stone Giant — Riduzione Danni 1×/SR (Constitution)" },
    { key: "Storm's Thunder",  label: "Storm Giant — Danno Tuono Bonus (Strength)" },
  ];
  specs.push({ key: 'species_version', label: 'Giant Ancestry', type: 'option', options: ancestryOpts, count: 1, level: 1 });
  return specs;
});
