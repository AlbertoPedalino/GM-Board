registerSpeciesAdapter("Shifter_EFA", function (s) {
  const specs = genericSpeciesParser(s);

  if (Array.isArray(s._versions) && s._versions.length) {
    const opts = s._versions.map(v => ({
      key: v.name,
      label: String(v.name || '').includes(';')
        ? String(v.name).split(';')[1].trim()
        : v.name,
    }));
    specs.push({
      key: 'species_version',
      label: 'Shifter Lineage',
      type: 'option',
      options: opts,
      count: 1,
      level: 1,
    });
  }

  return specs;
});
