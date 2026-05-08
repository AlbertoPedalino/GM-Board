import { registerSpeciesAdapter, registerSpeciesSheetCommonChoiceMeta } from '../registry.js';

registerSpeciesAdapter("Changeling_EFA", function (s) {
  return getGenericSpeciesChoiceSpecs(s);
});

registerSpeciesSheetCommonChoiceMeta("Changeling_EFA");
