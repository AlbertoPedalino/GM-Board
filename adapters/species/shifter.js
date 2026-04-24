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

registerSpeciesSheetCommonChoiceMeta("Shifter_EFA", {
  labels: {
    species_version: 'Shifter Lineage',
  },
});
registerSpeciesSheetActions("Shifter_EFA", [
  {
    name: 'Shift',
    icon: '',
    cat: 'bonus',
    uses: 'PB / LR',
    resKey: 'shifter_shift',
    minLevel: 1,
    desc: 'Shift for 1 minute and gain lineage-specific benefits.',
  },
]);
registerSpeciesSheetResources("Shifter_EFA", [
  {
    key: 'shifter_shift',
    name: 'Shift',
    icon: 'moon',
    recharge: 'LR',
    max: () => getPB(),
  },
]);
