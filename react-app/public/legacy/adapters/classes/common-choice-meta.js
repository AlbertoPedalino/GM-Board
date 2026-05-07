(function () {
  const norm = typeof _normAdapterKey === "function"
    ? _normAdapterKey
    : function (v) { return String(v || "").toLowerCase().replace(/[^a-z0-9]/g, ""); };

  const scoreKey = function (k) {
    const s = String(k || "");
    let score = 0;
    if (/[A-Z]/.test(s)) score += 2;
    if (/\s/.test(s)) score += 2;
    if (!/^[a-z0-9_]+$/.test(s)) score += 1;
    return score;
  };
  const chooseBetter = function (prev, next) {
    if (!prev) return next;
    return scoreKey(next) >= scoreKey(prev) ? next : prev;
  };

  if (typeof registerClassSheetCommonChoiceMeta === "function") {
    const classKeys = new Map();
    Object.keys(typeof ClassAdapters !== "undefined" ? ClassAdapters : {}).forEach(function (k) {
      if (!k || k.includes("_")) return;
      const canon = norm(k);
      classKeys.set(canon, chooseBetter(classKeys.get(canon), k));
    });
    classKeys.forEach(function (k) {
      registerClassSheetCommonChoiceMeta(k);
    });
  }

  if (typeof registerSubclassSheetCommonChoiceMeta === "function") {
    const subclassKeys = new Map();
    Object.keys(typeof SubclassAdapters !== "undefined" ? SubclassAdapters : {}).forEach(function (k) {
      if (!k || !k.includes("_")) return;
      const i = k.indexOf("_");
      if (i < 0) return;
      const canon = norm(k.slice(0, i)) + "_" + norm(k.slice(i + 1));
      subclassKeys.set(canon, chooseBetter(subclassKeys.get(canon), k));
    });
    subclassKeys.forEach(function (k) {
      registerSubclassSheetCommonChoiceMeta(k);
    });
  }

  if (typeof registerSpeciesSheetCommonChoiceMeta === "function") {
    const speciesKeys = new Map();
    Object.keys(typeof SpeciesAdapters !== "undefined" ? SpeciesAdapters : {}).forEach(function (k) {
      if (!k || !k.includes("_")) return;
      const i = k.lastIndexOf("_");
      if (i < 0) return;
      const canon = norm(k.slice(0, i)) + "_" + norm(k.slice(i + 1));
      speciesKeys.set(canon, chooseBetter(speciesKeys.get(canon), k));
    });
    speciesKeys.forEach(function (k) {
      registerSpeciesSheetCommonChoiceMeta(k);
    });
  }
})();
