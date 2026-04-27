/**
 * adapters/spells/core.js
 *
 * Pipeline di normalizzazione per spell raw 5etools.
 * Pattern identico a adapters/feats/core.js.
 *
 * Espone globalmente:
 *   adaptSpellRecord(rawSpell, ctx)      — normalizza + merge adapter data + global adapters
 *   adaptSpellsDataset(rawSpells, ctx)   — map su array
 *
 * Global adapters (stile all-feats):
 *   registerGlobalSpellAdapter(fn)  — già in registry.js
 *   getGlobalSpellAdapters()        — già in registry.js
 */

(function (global) {
  "use strict";

  /* ── Costanti ─────────────────────────────────────────────────── */
  const SCHOOL_FULL = {
    A: "Abjuration",
    C: "Conjuration",
    D: "Divination",
    E: "Enchantment",
    V: "Evocation",
    I: "Illusion",
    N: "Necromancy",
    T: "Transmutation",
  };

  /* ── Helpers interni ──────────────────────────────────────────── */
  function _spellNorm(v) {
    return String(v || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function _normalizeRange(range) {
    if (!range || typeof range !== "object") return "varies";
    const type = String(range.type || "").toLowerCase();
    if (type === "self")      return "Self";
    if (type === "touch")     return "Touch";
    if (type === "sight")     return "Sight";
    if (type === "unlimited") return "Unlimited";
    if (type === "special")   return "Special";
    if (range.distance) {
      const d = range.distance;
      const amount = d.amount != null ? d.amount : "";
      const unit = String(d.type || "")
        .replace(/feet|foot/i, "ft")
        .replace(/miles?/i, "mi");
      return amount !== "" ? `${amount} ${unit}`.trim() : unit || "varies";
    }
    return "varies";
  }

  function _normalizeCastingTime(time) {
    if (!Array.isArray(time) || !time.length) return "";
    const t = time[0];
    if (!t || typeof t !== "object") return "";
    const n = t.number != null ? t.number : 1;
    const unit = String(t.unit || "").toLowerCase();
    if (n === 1 && unit === "action")   return "1 Action";
    if (n === 1 && unit === "bonus")    return "1 Bonus Action";
    if (n === 1 && unit === "reaction") return "1 Reaction";
    if (unit === "minute") return `${n} Minute${n !== 1 ? "s" : ""}`;
    if (unit === "hour")   return `${n} Hour${n !== 1 ? "s" : ""}`;
    return `${n} ${unit}`;
  }

  function _normalizeDuration(duration) {
    if (!Array.isArray(duration) || !duration.length) return "";
    const d = duration[0];
    if (!d || typeof d !== "object") return "";
    const type = String(d.type || "").toLowerCase();
    if (type === "instant")   return "Instantaneous";
    if (type === "permanent") return "Until dispelled";
    if (type === "special")   return "Special";
    if (d.duration) {
      const n    = d.duration.amount != null ? d.duration.amount : "";
      const unit = String(d.duration.type || "");
      const conc = d.concentration ? " (C)" : "";
      return n !== "" ? `${n} ${unit}${conc}` : `${unit}${conc}`;
    }
    return type;
  }

  function _isConcentration(duration) {
    return Array.isArray(duration) && duration.some(function (d) {
      return d && typeof d === "object" && !!d.concentration;
    });
  }

  /* ── Normalizzazione record ───────────────────────────────────── */
  function _spellNormalizeRecord(rawSpell, ctx) {
    const raw  = rawSpell && typeof rawSpell === "object" ? rawSpell : {};
    const name = String(raw.name || "").trim();
    const level = typeof raw.level === "number" ? raw.level : 0;
    const isCantrip = level === 0;
    const school = String(raw.school || "");

    const spell = Object.assign({}, raw);
    spell.name         = name || "Unknown Spell";
    spell.source       = String(raw.source || (ctx && ctx.defaultSource) || "").trim();
    spell.level        = level;
    spell.isCantrip    = isCantrip;
    spell.schoolFull   = SCHOOL_FULL[school] || school;
    spell.rangeText    = _normalizeRange(raw.range);
    spell.castingTime  = _normalizeCastingTime(raw.time);
    spell.durationText = _normalizeDuration(raw.duration);
    spell.concentration = _isConcentration(raw.duration);

    // Merge overlay data dall'adapter (cantrips.js / spells.js)
    var adapterData = null;
    if (isCantrip) {
      adapterData = typeof global.getCantripData === "function"
        ? global.getCantripData(name)
        : null;
    } else {
      adapterData = typeof global.getSpellData === "function"
        ? global.getSpellData(name)
        : null;
    }
    if (adapterData && typeof adapterData === "object") {
      spell._adapterData = adapterData;
    }

    spell._meta = Object.assign(
      {},
      raw._meta && typeof raw._meta === "object" ? raw._meta : {},
      {
        spellKey:  _spellNorm(name) + "_" + _spellNorm(spell.source),
        isCantrip: isCantrip,
        isAdapted: true,
      }
    );

    return spell;
  }

  /* ── Pipeline global adapters ─────────────────────────────────── */
  function _spellRunGlobalAdapters(spell, ctx) {
    var list = typeof global.getGlobalSpellAdapters === "function"
      ? global.getGlobalSpellAdapters()
      : [];
    if (!Array.isArray(list)) return spell;
    return list.reduce(function (acc, fn) {
      if (typeof fn !== "function") return acc;
      try {
        var next = fn(acc, ctx);
        return next && typeof next === "object" ? next : acc;
      } catch (err) {
        console.warn("[SpellAdapter] global adapter error for", acc && acc.name, err);
        return acc;
      }
    }, spell && typeof spell === "object" ? Object.assign({}, spell) : spell);
  }

  /* ── API pubblica ─────────────────────────────────────────────── */
  function adaptSpellRecord(rawSpell, ctx) {
    return _spellRunGlobalAdapters(_spellNormalizeRecord(rawSpell, ctx), ctx);
  }

  function adaptSpellsDataset(rawSpells, ctx) {
    if (!Array.isArray(rawSpells)) return [];
    return rawSpells.map(function (s) { return adaptSpellRecord(s, ctx); });
  }

  /* ── Reaction spell detection ────────────────────────────────── */

  /**
   * Returns all spells the character has that have casting time "reaction".
   * @param {object} character  - C object (selectedCantrips, selectedSpells, autoGrantedSpells, spellSnapshots)
   * @param {Array}  spellDb    - loaded 5etools spell array (sheetSpellDb)
   * @param {Array}  [extra]    - additional spell names (e.g. feat cantrips from choices)
   * @returns {{ name:string, source:string, condition:string, entries:Array }[]}
   */
  function getReactionSpells(character, spellDb, extra) {
    if (!character) return [];
    var snapshots = Array.isArray(character.spellSnapshots) ? character.spellSnapshots : [];
    var db = Array.isArray(spellDb) ? spellDb : [];
    var seen = {};
    var result = [];

    var names = [].concat(
      Array.isArray(character.selectedCantrips) ? character.selectedCantrips : [],
      Object.values(character.selectedSpells || {}).reduce(function(a, b){ return a.concat(Array.isArray(b) ? b : []); }, []),
      (Array.isArray(character.autoGrantedSpells) ? character.autoGrantedSpells : []).map(function(s){ return typeof s === 'string' ? s : (s && s.name) || ''; }),
      Array.isArray(extra) ? extra : []
    );

    for (var i = 0; i < names.length; i++) {
      var sName = String(names[i] || '').trim();
      if (!sName || seen[sName]) continue;
      seen[sName] = true;

      var full = db.find(function(s){ return s.name === sName; }) || null;
      var snap = snapshots.find(function(s){ return s.name === sName; }) || null;
      var time0 = (full && full.time && full.time[0]) || (snap && snap.time && snap.time[0]) || null;
      if (!time0 || String(time0.unit || '').toLowerCase() !== 'reaction') continue;

      result.push({
        name:      sName,
        source:    String((full && full.source) || (snap && snap.source) || ''),
        condition: String(time0.condition || ''),
        entries:   (full && full.entries) || (snap && snap.entries) || [],
      });
    }

    return result;
  }

  global.adaptSpellRecord    = adaptSpellRecord;
  global.adaptSpellsDataset  = adaptSpellsDataset;
  global.getReactionSpells   = getReactionSpells;

})(typeof window !== "undefined" ? window : globalThis);
