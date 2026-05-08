import { registerFeatSheetActions, registerFeatSheetResources } from '../registry.js';
registerFeatSheetResources("Chef", [
      {
        key: "chef_treats",
        name: "Bolstering Treats",
        icon: "chef-hat",
        recharge: "LR",
        max: function (char) {
          return typeof getProfBonus === "function"
            ? getProfBonus(char && (char.classLevel || char.level) || 1)
            : 2;
        }
      }
    ]);

registerFeatSheetActions("Chef", [
      {
        name: "Replenishing Meal",
        icon: "chef-hat",
        cat: "action",
        uses: "Short Rest",
        desc: "During a Short Rest, cook special food for up to 4 + PB creatures. Each creature that eats the food and spends Hit Dice regains an extra 1d8 HP."
      },
      {
        name: "Bolstering Treats",
        icon: "chef-hat",
        cat: "action",
        resKey: "chef_treats",
        uses: "Bonus Action",
        desc: "A creature eats one of your treats (cooked in 1 hour or after a Long Rest, up to PB treats lasting 8 hours) to gain Temporary HP equal to your Proficiency Bonus."
      }
    ]);
