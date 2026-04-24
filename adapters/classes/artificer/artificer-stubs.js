// Alchemist (EFA): experimental elixirs and restoratives are runtime effects; no builder-time choices here.
registerSubclassAdapter("Artificer_Alchemist", function (cls, lv, specs) {});

// Armorer (EFA): armor model behavior is managed in play; no persistent picker required in builder.
registerSubclassAdapter("Artificer_Armorer", function (cls, lv, specs) {});

// Artillerist (EFA): eldritch cannon choices are tactical/runtime, not permanent build picks.
registerSubclassAdapter("Artificer_Artillerist", function (cls, lv, specs) {});

// Battle Smith (EFA): steel defender and battle features are runtime; no static selection slot needed.
registerSubclassAdapter("Artificer_Battle Smith", function (cls, lv, specs) {});

// Cartographer (EFA): subclass features are passive/automatic in current data model.
registerSubclassAdapter("Artificer_Cartographer", function (cls, lv, specs) {});
