registerSpeciesAdapter("Khoravar_EFA", function (s) {
  const specs = genericSpeciesParser(s);

  const abilityChoices = (s.additionalSpells || [])
    .flatMap(g => g?.ability?.choose || [])
    .filter(Boolean);
  const uniqueAbilities = [...new Set(abilityChoices)];

  if (uniqueAbilities.length) {
    specs.push({
      key: 'species_spell_ability',
      label: 'Spellcasting Ability (Khoravar)',
      type: 'ability_choice',
      from: uniqueAbilities,
      count: 1,
      level: 1,
    });
  }

  return specs;
});
