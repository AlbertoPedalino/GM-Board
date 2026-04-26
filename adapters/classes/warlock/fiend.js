registerSubclassAdapter("Warlock_Fiend", function (cls, lv, specs) {});

registerSubclassSheetActions("Warlock_Fiend", [
  {
    "name": "Dark One's Blessing",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "inlinePills": ({ ownerLevel, character }) => {
      const lv = Number(ownerLevel || 1);
      const cha = typeof getMod === "function" && typeof getFinal === "function"
        ? Number(getMod(getFinal("cha")) || 0)
        : 0;
      return [{ icon: "skull", label: "Temp HP", value: Math.max(1, lv + cha) }];
    },
    "desc": "When you kill a creature with CR >= 1: gain temporary HP equal to your Warlock level + CHA mod."
  }
]);
