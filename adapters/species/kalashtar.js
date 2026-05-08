import { registerSpeciesAdapter, registerSpeciesSheetCommonChoiceMeta } from '../registry.js';

registerSpeciesAdapter("Kalashtar_EFA", function (s) {
  return getGenericSpeciesChoiceSpecs(s);
});

registerSpeciesSheetCommonChoiceMeta("Kalashtar_EFA");
