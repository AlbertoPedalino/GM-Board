registerSpeciesAdapter("Orc_XPHB", function (s) {
  return genericSpeciesParser(s);
});

registerSpeciesSheetCommonChoiceMeta("Orc_XPHB");
registerSpeciesSheetActions("Orc_XPHB", [
  {
    name: 'Adrenaline Rush',
    icon: '',
    cat: 'bonus',
    uses: 'PB / LR',
    resKey: 'orc_adrenaline_rush',
    minLevel: 1,
    desc: 'Take the Dash action as a Bonus Action and gain temporary hit points.',
  },
]);
registerSpeciesSheetResources("Orc_XPHB", [
  {
    key: 'orc_adrenaline_rush',
    name: 'Adrenaline Rush',
    icon: 'zap',
    recharge: 'LR',
    max: () => getPB(),
  },
]);
