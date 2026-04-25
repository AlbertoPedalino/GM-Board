(function (global) {
  "use strict";

  function _featToArray(v) {
    if (Array.isArray(v)) return v;
    if (v == null) return [];
    return [v];
  }

  function _featNorm(v) {
    return String(v || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

  function _featCleanTag(str) {
    return String(str || "")
      .split("|")[0]
      .replace(/\{@\w+\s+/g, "")
      .replace(/\}/g, "")
      .trim();
  }

  function _featUnique(items) {
    const out = [];
    const seen = new Set();
    items.forEach(function (item) {
      const v = String(item || "").trim();
      if (!v) return;
      const k = v.toLowerCase();
      if (seen.has(k)) return;
      seen.add(k);
      out.push(v);
    });
    return out;
  }

  function _featCategoryCodes(rawCategory) {
    const values = [];
    _featToArray(rawCategory).forEach(function (cat) {
      if (Array.isArray(cat)) {
        values.push.apply(values, _featCategoryCodes(cat));
        return;
      }
      if (cat == null) return;
      const raw = String(cat).trim();
      if (!raw) return;
      values.push(raw);
    });

    const mapped = values.map(function (cat) {
      const c = String(cat || "").trim();
      const lc = c.toLowerCase();
      if (lc === "origin") return "O";
      if (lc === "general") return "G";
      if (lc === "fighting style") return "FS";
      if (lc === "epic boon") return "EB";
      if (lc === "druidic") return "D";
      if (lc === "fightingstyle") return "FS";
      if (lc === "epicboon") return "EB";
      if (lc === "origins") return "O";
      return c;
    });

    return _featUnique(mapped);
  }

  function _featExtractNumericLevel(node, expectLevelValue) {
    if (node == null) return null;
    const expectLevel = !!expectLevelValue;
    if (typeof node === "number" && Number.isFinite(node)) {
      return expectLevel ? Number(node) : null;
    }
    if (typeof node === "string") {
      const m = node.match(/\blevel\s*(\d+)\b/i);
      if (m) return Number(m[1]);
      const n = Number(node);
      if (expectLevel && Number.isFinite(n)) return n;
      return null;
    }
    if (Array.isArray(node)) {
      const vals = node
        .map(function (v) { return _featExtractNumericLevel(v, expectLevel); })
        .filter(function (n) { return Number.isFinite(n); });
      if (!vals.length) return null;
      return Math.min.apply(null, vals);
    }
    if (typeof node === "object") {
      const vals = [];
      if (node.level != null) {
        const lv = _featExtractNumericLevel(node.level, true);
        if (Number.isFinite(lv)) vals.push(lv);
      }
      Object.entries(node).forEach(function (entry) {
        const key = String(entry[0] || "");
        const value = entry[1];
        if (key.toLowerCase() === "level") return;
        const byKey = /\blevel\b/i.test(key);
        const nested = _featExtractNumericLevel(value, byKey);
        if (Number.isFinite(nested)) vals.push(nested);
      });
      if (!vals.length) return null;
      return Math.min.apply(null, vals);
    }
    return null;
  }

  function _featNormalizePrerequisites(prerequisite) {
    return _featToArray(prerequisite).filter(function (p) {
      if (p == null) return false;
      if (typeof p === "string") return p.trim().length > 0;
      return typeof p === "object";
    });
  }

  function _featFormatPrereqPart(pr) {
    if (!pr) return "";
    if (typeof pr === "string") return _featCleanTag(pr);

    if (pr.level != null) {
      const lv = _featExtractNumericLevel(pr.level);
      if (Number.isFinite(lv)) return "Lv." + lv;
    }

    if (Array.isArray(pr.ability) && pr.ability.length) {
      const labels = [];
      pr.ability.forEach(function (ab) {
        if (!ab || typeof ab !== "object") return;
        Object.entries(ab).forEach(function (entry) {
          const k = entry[0];
          const v = entry[1];
          const labelMap = (typeof global.SLBL !== "undefined" && global.SLBL) || {};
          labels.push((labelMap[k] || String(k).toUpperCase()) + " " + v);
        });
      });
      if (labels.length) return labels.join(", ");
    }

    if (pr.spellcasting) return "Spellcasting";
    if (pr.proficiency) return "Proficiency";
    if (pr.feat) return "Feat";
    if (pr.pact) return "Pact";
    if (pr.class) return "Class";
    if (pr.background) return "Background";
    if (pr.species) return "Species";

    const flat = Object.values(pr)
      .flatMap(function (v) { return _featToArray(v); })
      .map(function (v) { return _featCleanTag(v); })
      .filter(Boolean);
    return flat[0] || "";
  }

  function _featFormatPrerequisite(prerequisite) {
    const parts = _featNormalizePrerequisites(prerequisite)
      .map(_featFormatPrereqPart)
      .filter(Boolean);
    return parts.join(" - ");
  }

  function _featNormalizeRecord(rawFeat, ctx) {
    const raw = rawFeat && typeof rawFeat === "object" ? rawFeat : {};
    const name = String(raw.name || "").trim();
    const source = String(raw.source || ctx?.defaultSource || "").trim();
    const categories = _featCategoryCodes(raw.categories || raw.category);
    const prerequisite = _featNormalizePrerequisites(raw.prerequisite);
    const minLevel = _featExtractNumericLevel(prerequisite);

    const feat = { ...raw };
    feat.name = name || "Unnamed Feat";
    feat.source = source || "UNKNOWN";
    feat.category = categories[0] || "";
    feat.categories = categories;
    feat.prerequisite = prerequisite;
    feat.prerequisiteText = _featFormatPrerequisite(prerequisite);
    feat.additionalSpells = _featToArray(raw.additionalSpells);

    [
      "skillProficiencies",
      "toolProficiencies",
      "languageProficiencies",
      "skillToolLanguageProficiencies",
      "weaponProficiencies",
      "armorProficiencies",
      "resist",
      "immune"
    ].forEach(function (field) {
      feat[field] = _featToArray(raw[field]);
    });

    if (!Array.isArray(feat.entries) && feat.entries != null) feat.entries = [feat.entries];
    if (feat.entries == null) feat.entries = [];

    const featKey = _featNorm(feat.name) + "_" + _featNorm(feat.source || "");
    feat._meta = {
      ...(raw._meta && typeof raw._meta === "object" ? raw._meta : {}),
      featKey: featKey,
      minLevel: Number.isFinite(minLevel) ? minLevel : null,
      categoryCodes: categories,
      isFeatAdapted: true
    };

    return feat;
  }

  function _featGetCustomAdapter(name, source) {
    if (typeof global.getFeatAdapter === "function") {
      const byFull = global.getFeatAdapter(name, source);
      if (typeof byFull === "function") return byFull;
      const byName = global.getFeatAdapter(name, "");
      if (typeof byName === "function") return byName;
    }
    return null;
  }

  function _featRunGlobalAdapters(feat, ctx) {
    const out = feat && typeof feat === "object" ? { ...feat } : feat;
    const list = typeof global.getGlobalFeatAdapters === "function"
      ? global.getGlobalFeatAdapters()
      : [];
    return (Array.isArray(list) ? list : []).reduce(function (acc, fn) {
      if (typeof fn !== "function") return acc;
      try {
        const next = fn(acc, ctx);
        return next && typeof next === "object" ? next : acc;
      } catch (err) {
        console.warn("[FeatAdapter] global adapter error for", acc?.name, acc?.source, err);
        return acc;
      }
    }, out);
  }

  function adaptFeatRecord(rawFeat, ctx) {
    const base = _featRunGlobalAdapters(_featNormalizeRecord(rawFeat, ctx), ctx);
    const custom = _featGetCustomAdapter(base.name, base.source);
    if (typeof custom !== "function") return base;

    try {
      const maybe = custom({ ...base }, ctx);
      const normalized = _featNormalizeRecord(
        maybe && typeof maybe === "object" ? maybe : base,
        ctx
      );
      return _featRunGlobalAdapters(normalized, ctx);
    } catch (err) {
      console.warn("[FeatAdapter] adapter error for", base.name, base.source, err);
      return base;
    }
  }

  function adaptFeatsDataset(rawFeats, ctx) {
    return _featToArray(rawFeats).map(function (feat) {
      return adaptFeatRecord(feat, ctx);
    });
  }

  function getFeatCategoryCodes(feat) {
    if (!feat || typeof feat !== "object") return [];
    if (Array.isArray(feat.categories) && feat.categories.length) return feat.categories.slice();
    return _featCategoryCodes(feat.category);
  }

  function featHasCategory(feat, category) {
    const wanted = String(category || "").trim();
    if (!wanted) return true;
    return getFeatCategoryCodes(feat).some(function (cat) {
      return cat === wanted || String(cat).startsWith(wanted);
    });
  }

  function getFeatMinLevel(feat) {
    if (!feat || typeof feat !== "object") return null;
    const fromMeta = feat._meta && feat._meta.minLevel;
    if (Number.isFinite(fromMeta)) return Number(fromMeta);
    return _featExtractNumericLevel(feat.prerequisite);
  }

  function formatFeatPrerequisite(feat) {
    if (!feat || typeof feat !== "object") return "";
    if (typeof feat.prerequisiteText === "string" && feat.prerequisiteText.trim()) {
      return feat.prerequisiteText.trim();
    }
    return _featFormatPrerequisite(feat.prerequisite);
  }

  global.adaptFeatRecord = adaptFeatRecord;
  global.adaptFeatsDataset = adaptFeatsDataset;
  global.getFeatCategoryCodes = getFeatCategoryCodes;
  global.featHasCategory = featHasCategory;
  global.getFeatMinLevel = getFeatMinLevel;
  global.formatFeatPrerequisite = formatFeatPrerequisite;
})(typeof window !== "undefined" ? window : globalThis);
