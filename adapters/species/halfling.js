import { registerSpeciesAdapter, registerSpeciesSheetCommonChoiceMeta } from '../registry.js';

registerSpeciesAdapter("Halfling_XPHB", function (s) {
  return getGenericSpeciesChoiceSpecs(s);
});

registerSpeciesSheetCommonChoiceMeta("Halfling_XPHB");
