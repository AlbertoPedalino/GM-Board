// Human XPHB: Versatile — extra Origin Feat + lingua bonus
registerSpeciesAdapter("Human_XPHB", function (s) {
  let specs = genericSpeciesParser(s);
  specs.push({
    key: 'species_origin_feat',
    label: 'Versatile — Talento Origine Extra',
    type: 'feat_cat',
    categories: ['O'],
    count: 1,
    level: 1,
  });
  return specs;
});
