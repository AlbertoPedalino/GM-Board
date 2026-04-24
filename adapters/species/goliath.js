// Goliath XPHB: Giant Ancestry — scelta del tipo di gigante (determina resistenza e abilità)
registerSpeciesAdapter("Goliath_XPHB", function (s) {
  let specs = genericSpeciesParser(s);
  const ancestryOpts = [
    { key: "Cloud's Jaunt",    label: "Cloud Giant — Teleport (Intelligence)" },
    { key: "Fire's Burn",      label: "Fire Giant — Bonus Fire Damage (Strength)" },
    { key: "Frost's Chill",    label: "Frost Giant — Cold Damage + Slow (Constitution)" },
    { key: "Hill's Tumble",    label: "Hill Giant — Knock Prone (Strength)" },
    { key: "Stone's Endurance",label: "Stone Giant — Damage Reduction 1×/SR (Constitution)" },
    { key: "Storm's Thunder",  label: "Storm Giant — Bonus Thunder Damage (Strength)" },
  ];
  specs.push({ key: 'species_version', label: 'Giant Ancestry', type: 'option', options: ancestryOpts, count: 1, level: 1 });
  return specs;
});

registerSpeciesSheetCommonChoiceMeta("Goliath_XPHB", {
  labels: {
    species_version: 'Giant Ancestry',
  },
});
