(function (global) {
  "use strict";

  function _arr(v) {
    return Array.isArray(v) ? v : (v == null ? [] : [v]);
  }

  function _title(v) {
    return String(v || "").charAt(0).toUpperCase() + String(v || "").slice(1);
  }

  function _defaults() {
    return {
      skills: Array.isArray(global.SKILLS) ? global.SKILLS.map(function (s) { return s?.n; }).filter(Boolean) : [],
      tools: Array.isArray(global._ALL_TOOLS) ? global._ALL_TOOLS.slice() : [],
      artisanTools: Array.isArray(global._ARTISAN_TOOLS) ? global._ARTISAN_TOOLS.slice() : [],
      musicalTools: Array.isArray(global._MUSICAL_INSTRUMENTS) ? global._MUSICAL_INSTRUMENTS.slice() : [],
      stdLangs: Array.isArray(global._STD_LANGS) ? global._STD_LANGS.slice() : [
        "Common", "Elvish", "Dwarvish", "Giant", "Gnomish", "Goblin", "Halfling", "Orc"
      ],
      allLangs: Array.isArray(global._ALL_LANGS) ? global._ALL_LANGS.slice() : [
        "Common", "Elvish", "Dwarvish", "Giant", "Gnomish", "Goblin", "Halfling", "Orc",
        "Draconic", "Infernal", "Celestial", "Undercommon", "Abyssal", "Sylvan", "Deep Speech", "Primordial"
      ],
      exoticLangs: ["Abyssal", "Sylvan", "Deep Speech", "Primordial"]
    };
  }

  function getGenericSpeciesChoiceSpecs(species) {
    const s = species && typeof species === "object" ? species : {};
    const d = _defaults();
    const specs = [];

    _arr(s.skillProficiencies).forEach(function (sp, idx) {
      if (!sp || typeof sp !== "object") return;
      if (!(sp.choose || sp.any)) return;
      const count = Number(sp?.choose?.count || sp.any || 1);
      const from = Array.isArray(sp?.choose?.from)
        ? sp.choose.from.map(_title)
        : d.skills.slice();
      specs.push({
        key: "species_skill_" + idx,
        label: "Choose Skill",
        type: "skill_choice",
        from: from,
        count: count,
        level: 1
      });
    });

    _arr(s.toolProficiencies).forEach(function (tp, idx) {
      if (!tp || typeof tp !== "object") return;
      if (!(tp.choose || tp.any || tp.anyArtisansTool || tp.anyMusicalInstrument)) return;
      const count = Number(tp?.choose?.count || tp.any || tp.anyArtisansTool || tp.anyMusicalInstrument || 1);
      let from = [];
      if (Array.isArray(tp?.choose?.from)) from = tp.choose.from.map(_title);
      else if (tp.anyArtisansTool) from = d.artisanTools.slice();
      else if (tp.anyMusicalInstrument) from = d.musicalTools.slice();
      else from = d.tools.slice();
      specs.push({
        key: "species_tool_" + idx,
        label: "Choose Tool Proficiency",
        type: "generic_choice",
        from: from,
        count: count,
        level: 1
      });
    });

    _arr(s.languageProficiencies).forEach(function (lp, idx) {
      if (!lp || typeof lp !== "object") return;
      if (!(lp.choose || lp.anyStandard || lp.anyExotic || lp.any)) return;
      const count = Number(lp.anyStandard || lp.anyExotic || lp.any || lp?.choose?.count || 1);
      let from = [];
      if (Array.isArray(lp?.choose?.from)) from = lp.choose.from.slice();
      else if (lp.anyExotic) from = d.exoticLangs.slice();
      else if (lp.anyStandard) from = d.stdLangs.slice();
      else from = d.allLangs.slice();
      specs.push({
        key: "species_language_" + idx,
        label: "Lingua Bonus",
        type: "language_choice",
        from: from,
        count: count,
        level: 1
      });
    });

    _arr(s.languages).forEach(function (lp, idx) {
      if (!lp || typeof lp !== "object") return;
      if (!(lp.choose || lp.anyStandard || lp.anyExotic || lp.any)) return;
      const count = Number(lp.anyStandard || lp.anyExotic || lp.any || lp?.choose?.count || 1);
      let from = [];
      if (Array.isArray(lp?.choose?.from)) from = lp.choose.from.slice();
      else if (lp.anyExotic) from = d.exoticLangs.slice();
      else if (lp.anyStandard) from = d.stdLangs.slice();
      else from = d.allLangs.slice();
      specs.push({
        key: "species_languages_alt_" + idx,
        label: "Lingua Bonus",
        type: "language_choice",
        from: from,
        count: count,
        level: 1
      });
    });

    if (Array.isArray(s.size) && s.size.length > 1) {
      const sizeMap = { M: "Media", S: "Piccola" };
      specs.push({
        key: "species_size",
        label: "Scegli Taglia",
        type: "generic_choice",
        from: s.size.map(function (v) { return sizeMap[v] || v; }),
        count: 1,
        level: 1
      });
    }

    _arr(s.resist).forEach(function (r, idx) {
      if (!r || typeof r !== "object" || !r.choose) return;
      const count = Number(r?.choose?.count || 1);
      const from = Array.isArray(r?.choose?.from)
        ? r.choose.from.map(_title)
        : [];
      if (!from.length) return;
      specs.push({
        key: "species_resist_" + idx,
        label: "Scegli Resistenza",
        type: "generic_choice",
        from: from,
        count: count,
        level: 1
      });
    });

    return specs;
  }

  global.getGenericSpeciesChoiceSpecs = getGenericSpeciesChoiceSpecs;

  /* ── Normalizzazione record specie ───────────────────────────── */
  function _speciesNorm(v) {
    return String(v || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function _speciesNormalizeRecord(rawSpecies, ctx) {
    var raw  = rawSpecies && typeof rawSpecies === "object" ? rawSpecies : {};
    var name = String(raw.name   || "").trim();
    var src  = String(raw.source || (ctx && ctx.defaultSource) || "").trim();

    var species  = Object.assign({}, raw);
    species.name   = name || "Unknown Species";
    species.source = src;

    // size sempre array
    if (!Array.isArray(species.size)) {
      species.size = species.size ? [species.size] : ["M"];
    }

    species._meta = Object.assign(
      {},
      raw._meta && typeof raw._meta === "object" ? raw._meta : {},
      {
        speciesKey: _speciesNorm(name) + "_" + _speciesNorm(src),
        isAdapted:  true,
      }
    );

    return species;
  }

  function _runGlobalSpeciesAdapters(species, ctx) {
    var list = typeof global.getGlobalSpeciesAdapters === "function"
      ? global.getGlobalSpeciesAdapters()
      : [];
    if (!Array.isArray(list)) return species;
    return list.reduce(function (acc, fn) {
      if (typeof fn !== "function") return acc;
      try {
        var next = fn(acc, ctx);
        return next && typeof next === "object" ? next : acc;
      } catch (err) {
        console.warn("[SpeciesAdapter] global adapter error for", acc && acc.name, err);
        return acc;
      }
    }, species && typeof species === "object" ? Object.assign({}, species) : species);
  }

  function adaptSpeciesRecord(rawSpecies, ctx) {
    return _runGlobalSpeciesAdapters(_speciesNormalizeRecord(rawSpecies, ctx), ctx);
  }

  function adaptSpeciesDataset(rawSpecies, ctx) {
    if (!Array.isArray(rawSpecies)) return [];
    return rawSpecies.map(function (s) { return adaptSpeciesRecord(s, ctx); });
  }

  global.adaptSpeciesRecord  = adaptSpeciesRecord;
  global.adaptSpeciesDataset = adaptSpeciesDataset;

})(typeof window !== "undefined" ? window : globalThis);
