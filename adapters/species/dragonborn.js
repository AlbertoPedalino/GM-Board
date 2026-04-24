registerSpeciesAdapter("Dragonborn_XPHB", function (s) {
  let specs = genericSpeciesParser(s);
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
    minLevel: 1,
    desc: 'Exhale destructive draconic energy; damage type depends on your Draconic Ancestry.',
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
