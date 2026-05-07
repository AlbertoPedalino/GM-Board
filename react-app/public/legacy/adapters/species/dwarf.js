registerSpeciesAdapter("Dwarf_XPHB", function (s) {
  return getGenericSpeciesChoiceSpecs(s);
});

registerSpeciesSheetCommonChoiceMeta("Dwarf_XPHB");

// Dwarven Toughness: +1 HP per character level
registerSpeciesSheetHpBonus("Dwarf_XPHB", 1);
