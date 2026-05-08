import { registerFeatSheetActions, registerFeatSheetResources } from '../registry.js';
registerFeatSheetResources("Inspiring Leader", [
      {
        key: "inspiring_speech",
        name: "Inspiring Speech",
        icon: "mic",
        recharge: "LR",
        max: function () { return 1; }
      }
    ]);

registerFeatSheetActions("Inspiring Leader", [
      {
        name: "Inspiring Speech",
        icon: "mic",
        cat: "action",
        resKey: "inspiring_speech",
        desc: "Spend 10 minutes giving an inspiring speech. Up to 6 creatures who can hear and understand you gain Temporary Hit Points equal to your Proficiency Bonus. Once per Long Rest."
      }
    ]);
