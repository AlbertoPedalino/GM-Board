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
    specs.push({ key: 'species_version', label: 'Ascendenza Draconica', type: 'option', options: opts, count: 1, level: 1 });
  }
  return specs;
});
