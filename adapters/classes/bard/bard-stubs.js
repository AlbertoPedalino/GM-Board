// College of Dance (XPHB): no player choices needed.
registerSubclassAdapter("Bard_Dance", function (cls, lv, specs) {});

// College of Glamour (XPHB): Mantle of Inspiration uses Bardic Inspiration; Mantle of Majesty and
// Unbreakable Majesty are 1/LR concentration features tracked as separate resources.
registerSubclassAdapter("Bard_Glamour", function (cls, lv, specs) {});

// College of Valor (XPHB): Combat Inspiration handled via subclass sheet actions adapter data.
registerSubclassAdapter("Bard_Valor", function (cls, lv, specs) {});
