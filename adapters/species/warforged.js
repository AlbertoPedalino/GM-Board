import { registerSpeciesAdapter, registerSpeciesSheetCommonChoiceMeta } from '../registry.js';

registerSpeciesAdapter("Warforged_EFA", function (s) {
  return getGenericSpeciesChoiceSpecs(s);
});

registerSpeciesSheetCommonChoiceMeta("Warforged_EFA");
