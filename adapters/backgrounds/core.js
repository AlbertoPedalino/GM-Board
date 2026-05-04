// adapters/backgrounds/core.js
// Generic 5etools background adapter for 2024-style structured background data.
(function (global) {
  "use strict";

  function _arr(v) {
    return Array.isArray(v) ? v : (v == null ? [] : [v]);
  }

  function _cleanTag(str) {
    return String(str || "")
      .split("|")[0]
      .replace(/\{@\w+\s+/g, "")
      .replace(/\}/g, "")
      .trim();
  }

  function _title(v) {
    const raw = _cleanTag(v);
    if (!raw) return "";
    return raw
      .split(/\s+/)
      .map(function (part) {
        return part ? part.charAt(0).toUpperCase() + part.slice(1) : "";
      })
      .join(" ");
  }

  function _camelToTitle(v) {
    return _cleanTag(v)
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function _defaults() {
    return {
      skills: Array.isArray(global.SKILLS) ? global.SKILLS.map(function (s) { return s?.n; }).filter(Boolean) : [],
      tools: Array.isArray(global._ALL_TOOLS) ? global._ALL_TOOLS.slice() : [],
      artisanTools: Array.isArray(global._ARTISAN_TOOLS) ? global._ARTISAN_TOOLS.slice() : [],
      musicalTools: Array.isArray(global._MUSICAL_INSTRUMENTS) ? global._MUSICAL_INSTRUMENTS.slice() : [],
      gamingSets: (global._GAMING_SETS || []).slice(),
      vehicleTools: (global._VEHICLE_TOOLS || []).slice(),
      stdLangs: (global._STD_LANGS || []).slice(),
      exoticLangs: (global._EXOTIC_LANGS || []).slice(),
      allLangs: (global._ALL_LANGS || []).slice(),
    };
  }

  function _pushSpec(specs, spec) {
    const from = Array.from(new Set(_arr(spec.from).map(_title).filter(Boolean)));
    if (!from.length && spec.type !== "feat_fixed") return;
    specs.push({ ...spec, from });
  }

  function _compact(v) {
    return String(v || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function _expandToolChoiceValues(values, d) {
    const out = [];
    _arr(values).forEach(function (raw) {
      const key = _compact(raw);
      if (key === "anytool" || key === "tool" || key === "tools") out.push.apply(out, d.tools);
      else if (key === "anyartisanstool" || key === "anyartisans" || key === "artisanstools") out.push.apply(out, d.artisanTools);
      else if (key === "anymusicalinstrument" || key === "musicalinstrument" || key === "instrumentmusical" || key === "instrument") out.push.apply(out, d.musicalTools);
      else if (key === "anygamingset" || key === "gamingset" || key === "setgaming") out.push.apply(out, d.gamingSets);
      else if (key === "vehicle" || key === "vehicles") out.push.apply(out, d.vehicleTools);
      else out.push(raw);
    });
    return out;
  }

  function getGenericBackgroundOriginFeat(background) {
    const bg = background && typeof background === "object" ? background : {};
    const featBlock = _arr(bg.feats)[0];
    if (!featBlock || typeof featBlock !== "object") return { fixed: null };

    const keys = Object.keys(featBlock).filter(function (k) { return k !== "choose" && featBlock[k] !== false; });
    if (!keys.length) return { fixed: null };

    const keyRaw = String(keys[0] || "");
    const featRaw = keyRaw.split(";")[0].trim().split("|")[0];
    const semicolonHint = keyRaw.split(";").slice(1).map(function (s) {
      return s.trim().split("|")[0];
    }).find(Boolean);
    const pipeHint = keyRaw.split("|").map(function (s) { return s.trim(); }).filter(Boolean)[2] || "";
    const classHintRaw = semicolonHint || pipeHint || "";
    const classHint = String(classHintRaw || "").toLowerCase().replace(/[^a-z]/g, "") || null;

    return {
      fixed: _camelToTitle(featRaw),
      classHint: classHint,
    };
  }

  function getGenericBackgroundChoiceSpecs(background) {
    const bg = background && typeof background === "object" ? background : {};
    const d = _defaults();
    const specs = [];

    const origin = getGenericBackgroundOriginFeat(bg);
    if (origin.fixed) {
      specs.push({
        key: "feat_origin",
        label: "Origin Feat",
        type: "feat_fixed",
        fixed: origin.fixed,
        classHint: origin.classHint || null,
        count: 1,
        level: 0,
      });
    }

    _arr(bg.skillProficiencies).forEach(function (block, idx) {
      if (!block || typeof block !== "object") return;
      const choose = block.choose || {};
      const count = Number(choose.count || block.any || 0);
      if (!count) return;
      const from = Array.isArray(choose.from) ? choose.from : d.skills;
      _pushSpec(specs, {
        key: "bg_skill_" + idx,
        label: "Background Skills",
        type: "skill_choice",
        from: from,
        count: count,
        level: 1,
      });
    });

    _arr(bg.toolProficiencies).forEach(function (block, idx) {
      if (!block || typeof block !== "object") return;
      const choose = block.choose || {};
      const count = Number(choose.count || block.any || block.anyTool || block.anyArtisansTool || block.anyMusicalInstrument || block.anyGamingSet || 0);
      if (!count) return;
      let from = Array.isArray(choose.from) ? _expandToolChoiceValues(choose.from, d) : [];
      if (!from.length) {
        if (block.anyArtisansTool) from = d.artisanTools;
        else if (block.anyMusicalInstrument) from = d.musicalTools;
        else if (block.anyGamingSet) from = d.gamingSets;
        else if (block.anyTool) from = d.tools;
        else from = d.tools;
      }
      _pushSpec(specs, {
        key: "bg_tool_" + idx,
        label: "Background Tools",
        type: "generic_choice",
        from: from,
        count: count,
        level: 1,
      });
    });

    _arr(bg.languageProficiencies).forEach(function (block, idx) {
      if (!block || typeof block !== "object") return;
      const choose = block.choose || {};
      const count = Number(choose.count || block.any || block.anyStandard || block.anyExotic || 0);
      if (!count) return;
      let from = Array.isArray(choose.from) ? choose.from : [];
      if (!from.length) {
        if (block.anyExotic) from = d.exoticLangs;
        else if (block.anyStandard) from = d.stdLangs;
        else from = d.allLangs;
      }
      _pushSpec(specs, {
        key: "bg_language_" + idx,
        label: "Background Languages",
        type: "language_choice",
        from: from,
        count: count,
        level: 1,
      });
    });

    _arr(bg.skillToolLanguageProficiencies).forEach(function (block, blockIdx) {
      _arr(block?.choose).forEach(function (choice, choiceIdx) {
        const count = Number(choice?.count || 0);
        const rawFrom = _arr(choice?.from);
        if (!count || !rawFrom.length) return;
        let from = [];
        if (rawFrom.includes("anySkill")) from = from.concat(d.skills);
        if (rawFrom.includes("anyTool")) from = from.concat(d.tools);
        if (rawFrom.includes("anyLanguage")) from = from.concat(d.allLangs);
        from = from.concat(_expandToolChoiceValues(rawFrom.filter(function (v) {
          return !["anySkill", "anyTool", "anyLanguage"].includes(v);
        }), d).filter(function (v) {
          return !["anyArtisansTool", "anyMusicalInstrument", "anyGamingSet"].includes(v);
        }));

        const skillSet = new Set(d.skills.map(function (s) { return String(s).toLowerCase(); }));
        const langSet = new Set(d.allLangs.map(function (s) { return String(s).toLowerCase(); }));
        const cleanFrom = Array.from(new Set(from.map(_title).filter(Boolean)));
        const lc = cleanFrom.map(function (s) { return String(s).toLowerCase(); });
        const type = lc.every(function (s) { return skillSet.has(s); })
          ? "skill_choice"
          : (lc.every(function (s) { return langSet.has(s); }) ? "language_choice" : "generic_choice");

        _pushSpec(specs, {
          key: "bg_stl_" + blockIdx + "_" + choiceIdx,
          label: "Background Proficiency",
          type: type,
          from: cleanFrom,
          count: count,
          level: 1,
        });
      });
    });

    return specs;
  }

  function getGenericBackgroundChoiceMeta() {
    return {
      sectionTitle: "Background Choices",
      isChoiceKey: function (choiceKey) {
        const k = String(choiceKey || "");
        return /^bg_/i.test(k) || /^feat_origin$/i.test(k);
      },
      getLabel: function (choiceKey) {
        const k = String(choiceKey || "");
        if (k === "feat_origin") return "Origin Feat";
        if (/^bg_skill_/i.test(k)) return "Background Skills";
        if (/^bg_tool_/i.test(k)) return "Background Tools";
        if (/^bg_language_/i.test(k)) return "Background Languages";
        if (/^bg_stl_/i.test(k)) return "Background Proficiency";
        return k.replace(/^bg_/i, "").replace(/_+/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
      },
      normalizeChoiceValue: function (value) {
        return _title(value);
      },
    };
  }

  global.getGenericBackgroundOriginFeat = getGenericBackgroundOriginFeat;
  global.getGenericBackgroundChoiceSpecs = getGenericBackgroundChoiceSpecs;
  global.getGenericBackgroundChoiceMeta = getGenericBackgroundChoiceMeta;
})(window);
