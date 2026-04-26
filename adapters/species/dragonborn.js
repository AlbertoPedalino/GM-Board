registerSpeciesAdapter("Dragonborn_XPHB", function (s) {
  let specs = getGenericSpeciesChoiceSpecs(s);
  specs = specs.filter(function (x) { return !x.key.startsWith('species_resist'); });
  if (s._versions) {
    const opts = [];
    s._versions.forEach(function (v) {
      if (v._abstract && v._implementations) {
        v._implementations.forEach(function (impl) {
          if (impl._variables) {
            opts.push({ key: impl.name || Object.values(impl._variables)[0], label: Object.values(impl._variables)[0] });
          }
        });
      }
    });
    specs.push({ key: 'species_version', label: 'Draconic Ancestry', type: 'option', options: opts, count: 1, level: 1 });
  }
  return specs;
});

registerSpeciesSheetCommonChoiceMeta("Dragonborn_XPHB", {
  labels: {
    species_version: 'Draconic Ancestry',
  },
});
registerSpeciesSheetActions("Dragonborn_XPHB", [
  {
    name: 'Breath Weapon',
    icon: '',
    cat: 'action',
    uses: 'PB / LR',
    resKey: 'dragonborn_breath',
    damageFormula: ({ character }) => {
      const lv = Number(character?.level || 1);
      const dice = lv >= 17 ? 4 : lv >= 11 ? 3 : lv >= 5 ? 2 : 1;
      return `${dice}d10`;
    },
    inlinePills: () => {
      const pb = typeof getPB === 'function' ? getPB() : 0;
      const con = typeof getMod === 'function' && typeof getFinal === 'function'
        ? Number(getMod(getFinal('con')) || 0)
        : 0;
      return [{ icon: 'shield', label: 'Save DC', value: 8 + pb + con }];
    },
    minLevel: 1,
    desc: 'Exhale destructive draconic energy in a 15 ft. cone or 30 ft. line. Each creature makes a CON save (DC = 8 + PB + CON mod); half damage on success. Damage type depends on your Draconic Ancestry.',
  },
]);
registerSpeciesSheetResources("Dragonborn_XPHB", [
  {
    key: 'dragonborn_breath',
    name: 'Breath Weapon',
    icon: 'flame',
    recharge: 'LR',
    max: () => getPB(),
  },
]);
