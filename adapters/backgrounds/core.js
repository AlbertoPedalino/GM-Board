import { _ALL_TOOLS, _ARTISAN_TOOLS, _MUSICAL_INSTRUMENTS, _GAMING_SETS, _VEHICLE_TOOLS, _STD_LANGS, _EXOTIC_LANGS, _ALL_LANGS } from '../registry.js';

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
    skills: Array.isArray(window.SKILLS) ? window.SKILLS.map(function (s) { return s?.n; }).filter(Boolean) : [],
    tools: _ALL_TOOLS.slice(),
    artisanTools: _ARTISAN_TOOLS.slice(),
    musicalTools: _MUSICAL_INSTRUMENTS.slice(),
    gamingSets: _GAMING_SETS.slice(),
    vehicleTools: _VEHICLE_TOOLS.slice(),
    stdLangs: _STD_LANGS.slice(),
    exoticLangs: _EXOTIC_LANGS.slice(),
    allLangs: _ALL_LANGS.slice(),
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

export function getGenericBackgroundOriginFeat(background) {
  const bg = background && typeof background === "object" ? background : {};
  const featBlock = _arr(bg.feats)[0];
  if (!featBlock || typeof featBlock !== "object") return { fixed: null };

  if (featBlock.choose && Array.isArray(featBlock.choose.from)) {
    return { choose: featBlock.choose.from.map(_cleanTag) };
  }

  if (typeof featBlock.name === "string" && featBlock.name.trim()) {
    return { fixed: _cleanTag(featBlock.name) };
  }

  return { fixed: null };
}

export function getGenericBackgroundChoiceSpecs(background) {
  const bg = background && typeof background === "object" ? background : {};
  const d = _defaults();
  const specs = [];

  _arr(bg.skillProficiencies).forEach(function (sp, idx) {
    if (!sp || typeof sp !== "object") return;
    if (!(sp.choose || sp.any)) return;
    const count = Number(sp?.choose?.count || sp.any || 1);
    const from = Array.isArray(sp?.choose?.from)
      ? sp.choose.from.map(_title)
      : d.skills.slice();
    _pushSpec(specs, {
      key: "background_skill_" + idx,
      label: "Choose Skill",
      type: "skill_choice",
      from: from,
      count: count,
      level: 1
    });
  });

  _arr(bg.toolProficiencies).forEach(function (tp, idx) {
    if (!tp || typeof tp !== "object") return;
    if (!(tp.choose || tp.any)) return;
    const count = Number(tp?.choose?.count || tp.any || 1);
    let from = [];
    if (Array.isArray(tp?.choose?.from)) from = _expandToolChoiceValues(tp.choose.from, d);
    else from = d.tools.slice();
    _pushSpec(specs, {
      key: "background_tool_" + idx,
      label: "Choose Tool Proficiency",
      type: "generic_choice",
      from: from,
      count: count,
      level: 1
    });
  });

  _arr(bg.languageProficiencies).forEach(function (lp, idx) {
    if (!lp || typeof lp !== "object") return;
    if (!(lp.choose || lp.anyStandard || lp.anyExotic || lp.any)) return;
    const count = Number(lp.anyStandard || lp.anyExotic || lp.any || lp?.choose?.count || 1);
    let from = [];
    if (Array.isArray(lp?.choose?.from)) from = lp.choose.from.slice();
    else if (lp.anyExotic) from = d.exoticLangs.slice();
    else if (lp.anyStandard) from = d.stdLangs.slice();
    else from = d.allLangs.slice();
    _pushSpec(specs, {
      key: "background_language_" + idx,
      label: "Lingua Bonus",
      type: "language_choice",
      from: from,
      count: count,
      level: 1
    });
  });

  const featInfo = getGenericBackgroundOriginFeat(bg);
  if (featInfo.choose && featInfo.choose.length) {
    _pushSpec(specs, {
      key: "background_origin_feat",
      label: "Origin Feat",
      type: "feat_cat",
      categories: featInfo.choose,
      count: 1,
      level: 1
    });
  } else if (featInfo.fixed) {
    _pushSpec(specs, {
      key: "background_origin_feat",
      label: "Origin Feat",
      type: "feat_fixed",
      from: [featInfo.fixed],
      count: 1,
      level: 1
    });
  }

  return specs;
}

export function adaptBackgroundRecord(rawBg, ctx) {
  if (!rawBg || typeof rawBg !== "object") return rawBg;
  return Object.assign({}, rawBg, {
    _meta: Object.assign(
      {},
      rawBg._meta && typeof rawBg._meta === "object" ? rawBg._meta : {},
      {
        isAdapted: true,
        bgKey: _compact(rawBg.name || "") + "_" + _compact(rawBg.source || ctx?.defaultSource || ""),
      }
    )
  });
}

export function adaptBackgroundsDataset(rawBgs, ctx) {
  return _arr(rawBgs).map(function (bg) { return adaptBackgroundRecord(bg, ctx); });
}

const _glob = typeof window !== 'undefined' ? window : null;
if (_glob) {
  _glob.getGenericBackgroundOriginFeat = getGenericBackgroundOriginFeat;
  _glob.getGenericBackgroundChoiceSpecs = getGenericBackgroundChoiceSpecs;
  _glob.adaptBackgroundRecord = adaptBackgroundRecord;
  _glob.adaptBackgroundsDataset = adaptBackgroundsDataset;
}
