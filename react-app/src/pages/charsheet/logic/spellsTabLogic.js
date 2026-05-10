import { FULL_SLOTS, HALF_SLOTS, PACT_SLOTS, THIRD_SLOTS } from '../../charbuilder/constants.js';
import { installedRegistry } from '../../../adapters/index.js';
import { renderEntries as renderSafeEntries } from './renderEntries.js';

export function buildSpellInfo(C, spellIndex) {
  const rows = new Map();
  const lockedNames = new Set();
  const push = (name, source, locked = false, castLevel = null, fallbackLevel = 0) => {
    const full = spellIndex.get(norm(name));
    const spell = { ...(full || {}), name, level: Number(full?.level ?? fallbackLevel ?? 0) };
    const key = `${norm(name)}|${castLevel || spell.level}`;
    const row = { ...spell, sourceInfo: source, castLevel };
    const existing = rows.get(key);
    if (!existing || (!existing.sourceInfo && source) || (!existing.locked && locked)) {
      rows.set(key, { ...row, locked });
    }
    if (locked) {
      lockedNames.add(name);
      lockedNames.add(norm(name));
    }
  };

  (C?.selectedCantrips || []).forEach((name) => pushKnown(name, 0, null));
  Object.entries(C?.selectedSpells || {}).forEach(([level, names]) => {
    (names || []).forEach((name) => pushKnown(name, Number(level), null));
  });
  (C?.extraClasses || []).forEach((ec) => {
    (ec.selectedCantrips || []).forEach((name) => pushKnown(name, 0, { label: ec.name || 'Class', color: '#9d7fb8' }));
    Object.entries(ec.selectedSpells || {}).forEach(([level, names]) => {
      (names || []).forEach((name) => pushKnown(name, Number(level), { label: ec.name || 'Class', color: '#9d7fb8' }));
    });
  });

  collectChoiceSpells(C, spellIndex).forEach(({ name, source }) => push(name, source, true));
  collectAutoGrantedSpells(C).forEach(({ name, level, source }) => push(name, source, true, null, level));
  collectAtWillSpells(C).forEach(({ name, source }) => push(name, source, true));

  const all = [...rows.values()];
  const cantrips = all.filter((entry) => Number(entry.level || 0) === 0 && entry.sourceInfo?.kind !== 'atWill').sort(sortByName);
  const atWill = all.filter((entry) => entry.sourceInfo?.kind === 'atWill').sort(sortByName);
  const leveled = {};
  all.filter((entry) => Number(entry.level || 0) > 0 && entry.sourceInfo?.kind !== 'atWill').forEach((entry) => {
    const level = Number(entry.level || 0);
    if (!leveled[level]) leveled[level] = [];
    leveled[level].push(entry);
  });
  Object.values(leveled).forEach((entries) => entries.sort(sortByName));
  return { cantrips, atWill, leveled, lockedNames, lockedEntries: all.filter((entry) => entry.locked || lockedNames.has(entry.name) || lockedNames.has(norm(entry.name))) };

  function pushKnown(name, level, source) {
    const full = spellIndex.get(norm(name));
    if (full) push(name, source);
    else {
      const key = `${norm(name)}|${level}`;
      if (!rows.has(key)) rows.set(key, { name, level: Number(level || 0), sourceInfo: source });
    }
  }
}

function collectChoiceSpells(C, spellIndex) {
  const out = [];
  Object.entries(C?.choices || {}).forEach(([key, value]) => {
    const values = Array.isArray(value) ? value : [value];
    values.forEach((entry) => {
      if (typeof entry !== 'string') return;
      const name = entry.split('|')[0].trim();
      if (!name) return;
      if (!spellIndex.has(norm(name)) && !/(spell|cantrip|tome|magical|known|prepared|innate|expanded)/i.test(key)) return;
      if (['str', 'dex', 'con', 'int', 'wis', 'cha'].includes(norm(name))) return;
      out.push({ name, source: sourceFromChoiceKey(C, key) });
    });
  });
  return out;
}

function collectAutoGrantedSpells(C) {
  const out = [];
  (C?.autoGrantedSpells || []).forEach((entry) => {
    if (entry?.name) out.push({ name: entry.name, level: Number(entry.level ?? 0), source: { label: entry.source || 'Auto', color: '#70b7a6' } });
  });
  const entities = [{ className: C?.className, subclassShortName: C?.subclassShortName, level: C?.classLevel || C?.level || 1 }];
  (C?.extraClasses || []).forEach((ec) => entities.push({ className: ec.name, subclassShortName: ec.subclassShortName, level: ec.level || 1 }));
  entities.forEach((entity) => {
    const cfgs = [
      installedRegistry.getClassRuntimeConfig(entity.className),
      installedRegistry.getSubclassRuntimeConfig(entity.className, entity.subclassShortName),
    ];
    cfgs.forEach((cfg) => {
      [...(cfg?.spellcasting?.alwaysKnownSpells || []), ...(cfg?.spellcasting?.alwaysPreparedSpells || [])].forEach((spell) => {
        const name = typeof spell === 'string' ? spell : spell?.name;
        if (!name || entity.level < Number(spell?.minLevel || 1)) return;
        out.push({ name, level: Number(spell?.level ?? 0), source: { label: spell?.source || entity.subclassShortName || entity.className || 'Auto', color: '#70b7a6' } });
      });
    });
  });
  const seen = new Set();
  return out.filter((entry) => {
    const key = norm(entry.name);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function collectAtWillSpells(C) {
  const out = [];
  const choices = Object.entries(C?.choices || {});
  const hasInvocation = (name) => choices.some(([key, value]) => key.replace(/^mc\d+_/, '').startsWith('warlock_invocation_') && String(value).split('|')[0].trim() === name);
  const entities = [{ name: C?.className, level: C?.classLevel || C?.level || 1 }, ...(C?.extraClasses || []).map((ec) => ({ name: ec.name, level: ec.level || 1 }))];
  entities.forEach((entity) => {
    (installedRegistry.getClassAtWillSpells(entity.name) || []).forEach((entry) => {
      if (entity.level < Number(entry.minLevel || 1)) return;
      if (entry.invocation && !hasInvocation(entry.invocation)) return;
      out.push({ name: entry.spell, source: { label: entry.invocation || 'At Will', color: '#9d7fb8', kind: 'atWill' } });
    });
  });
  return out;
}

function sourceFromChoiceKey(C, key) {
  const grantKey = key.match(/^(.*)_(known|innate|prepared|expanded)_/i)?.[1];
  const featName = grantKey ? C?.choices?.[grantKey] : null;
  if (featName) return { label: String(featName), color: '#caa550' };
  if (key.startsWith('feat_')) return { label: 'Feat', color: '#caa550' };
  if (key.startsWith('subclass_')) return { label: C?.subclassShortName || 'Subclass', color: '#9d7fb8' };
  if (key.startsWith('species_')) return { label: C?.speciesName || 'Species', color: '#70b7a6' };
  if (key.includes('tome')) return { label: 'Pact of the Tome', color: '#9d7fb8' };
  return { label: 'Choice', color: '#9d7fb8' };
}

export function getResolvedCantripData(C, name) {
  if (!name) return null;
  const base = typeof installedRegistry.getCantripData === 'function'
    ? installedRegistry.getCantripData(name)
    : null;
  const modifiers = typeof installedRegistry.getCantripDataModifiers === 'function'
    ? (installedRegistry.getCantripDataModifiers(name) || [])
    : [];
  if (!base && !modifiers.length) return null;
  return modifiers.reduce((data, fn) => {
    if (typeof fn !== 'function') return data;
    try { return fn(data, C) || data; } catch { return data; }
  }, base ? { ...base } : {});
}

const ABILITY_KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export function resolveDmgBonusValue(C, dmgBonus, getModFn, getFinalFn) {
  if (dmgBonus == null || dmgBonus === '' || dmgBonus === 0) return 0;
  if (typeof dmgBonus === 'number') return dmgBonus;
  if (typeof dmgBonus === 'function') {
    try { return Number(dmgBonus({ character: C }) || 0); } catch { return 0; }
  }
  const key = String(dmgBonus).toLowerCase();
  if (ABILITY_KEYS.includes(key) && typeof getModFn === 'function' && typeof getFinalFn === 'function') {
    return Number(getModFn(getFinalFn(C, key)) || 0);
  }
  const n = Number(dmgBonus);
  return Number.isFinite(n) ? n : 0;
}

function spellModifierEntities(C) {
  if (!C) return [];
  const out = [{ className: C.className, subclassShortName: C.subclassShortName, level: C.classLevel || C.level || 1 }];
  (C.extraClasses || []).forEach((ec) => out.push({ className: ec.name, subclassShortName: ec.subclassShortName, level: ec.level || 1 }));
  return out.filter((entry) => entry.className);
}

function collectSpellModifiers(C) {
  const out = [];
  spellModifierEntities(C).forEach((entity) => {
    out.push(...((installedRegistry.getClassSheetSpellModifiers(entity.className) || []).map((mod) => ({ mod, ownerLevel: entity.level }))));
    out.push(...((installedRegistry.getSubclassSheetSpellModifiers(entity.className, entity.subclassShortName) || []).map((mod) => ({ mod, ownerLevel: entity.level }))));
  });
  if (C?.speciesName) {
    out.push(...((installedRegistry.getSpeciesSheetSpellModifiers(C.speciesName, C.speciesSource) || []).map((mod) => ({ mod, ownerLevel: C.level || 1 }))));
  }
  return out;
}

export function applySpellModifiers(C, ctx) {
  if (!ctx || !C) return ctx?.formula;
  let formula = ctx.formula;
  collectSpellModifiers(C).forEach(({ mod, ownerLevel }) => {
    if (!mod) return;
    if (typeof mod === 'function') {
      try {
        const next = mod({ ...ctx, formula, ownerLevel });
        if (typeof next === 'string' && next) formula = next;
      } catch {}
      return;
    }
    if (typeof mod === 'object') {
      if (mod.minLevel && Number(ownerLevel || 1) < Number(mod.minLevel)) return;
      if (mod.kind && mod.kind !== ctx.kind) return;
      if (typeof mod.condition === 'function' && !mod.condition({ ...ctx, ownerLevel })) return;
      const amount = typeof mod.amount === 'function' ? Number(mod.amount({ ...ctx, ownerLevel }) || 0) : Number(mod.amount || 0);
      if (!amount) return;
      formula = applyFlatBonus(formula, amount);
    }
  });
  return formula;
}

function applyFlatBonus(formula, amount) {
  if (!formula) return formula;
  const text = String(formula).replace(/\s+/g, '');
  const match = text.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
  if (!match) return formula;
  const count = Number(match[1]);
  const faces = Number(match[2]);
  const flat = Number(match[3] || 0) + amount;
  return `${count}d${faces}${flat ? (flat > 0 ? '+' : '') + flat : ''}`;
}

export function getSpellAbility(C) {
  const clsCfg = installedRegistry.getClassRuntimeConfig(C?.className)?.spellcasting;
  const subCfg = installedRegistry.getSubclassRuntimeConfig(C?.className, C?.subclassShortName)?.spellcasting;
  return String(subCfg?.ability || clsCfg?.ability || C?.choices?.species_spell_ability || 'cha').toLowerCase();
}

export function getSpellLimits(C) {
  const totals = getSpellEntities(C).reduce((sum, entity) => {
    const level = clampLevel(entity.level);
    const profile = getSpellcastingProfile(entity);
    if (!hasSpellcastingProfile(profile)) return sum;
    const cantrips = profile.cantripKnown?.[level - 1] ?? profile.cantripProgression?.[level - 1] ?? null;
    const spells = profile.spellsKnown?.[level - 1] ?? profile.preparedSpellsProgression?.[level - 1] ?? null;
    return {
      cantrips: addLimit(sum.cantrips, cantrips),
      spells: addLimit(sum.spells, spells),
    };
  }, { cantrips: null, spells: null });
  return totals;
}

export function getSheetSlots(C) {
  const entities = getSpellEntities(C);
  const casterEntities = entities
    .map((entity) => ({ ...entity, profile: getSpellcastingProfile(entity) }))
    .filter((entity) => hasSpellcastingProfile(entity.profile));
  if (!casterEntities.length) return { regular: [], pact: null };

  const pactEntity = casterEntities.find((entity) => normalizeProgression(entity.profile.casterProgression) === 'pact');
  const pact = pactEntity ? pactSlots(clampLevel(pactEntity.level)) : null;

  const regularEntities = casterEntities.filter((entity) => normalizeProgression(entity.profile.casterProgression) !== 'pact');
  if (!regularEntities.length) return { regular: [], pact };

  if (casterEntities.length === 1 && !pactEntity) {
    const entity = regularEntities[0];
    const level = clampLevel(entity.level);
    const prog = normalizeProgression(entity.profile.casterProgression);
    if (prog === 'full') return { regular: FULL_SLOTS[level] || [], pact };
    if (prog === 'half') return { regular: HALF_SLOTS[level] || [], pact };
    if (prog === 'third') return { regular: THIRD_SLOTS[level] || [], pact };
    if (prog === 'artificer') return { regular: HALF_SLOTS[level] || [], pact };
  }

  const casterLevel = regularEntities.reduce((sum, entity) => (
    sum + casterContribution(normalizeProgression(entity.profile.casterProgression), clampLevel(entity.level))
  ), 0);
  return { regular: casterLevel > 0 ? FULL_SLOTS[Math.min(20, casterLevel)] || [] : [], pact };
}

function getMaxCastableSpellLevel(slots) {
  const regularMax = (slots?.regular || []).reduce((max, count, index) => (count ? index + 1 : max), 0);
  return Math.max(regularMax, Number(slots?.pact?.level || 0));
}

export function getMaxLearnableSpellLevel(C) {
  return getSpellEntities(C).reduce((max, entity) => {
    const profile = getSpellcastingProfile(entity);
    const level = clampLevel(entity.level);
    const prog = normalizeProgression(profile.casterProgression);
    if (prog === 'pact') return Math.max(max, Number(pactSlots(level).level || 0));
    if (prog === 'full') return Math.max(max, getMaxCastableSpellLevel({ regular: FULL_SLOTS[level] || [] }));
    if (prog === 'half') return Math.max(max, getMaxCastableSpellLevel({ regular: HALF_SLOTS[level] || [] }));
    if (prog === 'third') return Math.max(max, getMaxCastableSpellLevel({ regular: THIRD_SLOTS[level] || [] }));
    if (prog === 'artificer') return Math.max(max, getMaxCastableSpellLevel({ regular: HALF_SLOTS[level] || [] }));
    return max;
  }, 0);
}

export function canManageSpells(C, limits) {
  if (!C) return false;
  if ((limits.cantrips || 0) > 0 || (limits.spells || 0) > 0) return true;
  if ((C.selectedCantrips || []).length || Object.values(C.selectedSpells || {}).flat().length) return true;
  return getSpellEntities(C).some((entity) => hasSpellcastingProfile(getSpellcastingProfile(entity)));
}

export function getSpellEntities(C) {
  if (!C) return [];
  return [
    {
      className: C.className,
      subclassShortName: C.subclassShortName,
      level: C.classLevel || C.level || 1,
      snapshot: C.clsSnapshot,
    },
    ...(C.extraClasses || []).map((extra) => ({
      className: extra.name,
      subclassShortName: extra.subclassShortName,
      level: extra.level || 1,
      snapshot: extra.clsSnapshot || extra.cls,
    })),
  ].filter((entity) => entity.className);
}

export function getSpellcastingProfile(entity) {
  const classCfg = installedRegistry.getClassRuntimeConfig(entity.className)?.spellcasting || {};
  const subCfg = installedRegistry.getSubclassRuntimeConfig(entity.className, entity.subclassShortName)?.spellcasting || {};
  return {
    ...classCfg,
    ...subCfg,
    casterProgression: subCfg.casterProgression || classCfg.casterProgression || entity.snapshot?.casterProgression,
    cantripProgression: entity.snapshot?.cantripProgression,
    preparedSpellsProgression: subCfg.preparedSpellsProgression || classCfg.preparedSpellsProgression || entity.snapshot?.preparedSpellsProgression,
    alwaysKnownSpells: [
      ...(classCfg.alwaysKnownSpells || []),
      ...(subCfg.alwaysKnownSpells || []),
    ],
    alwaysPreparedSpells: [
      ...(classCfg.alwaysPreparedSpells || []),
      ...(subCfg.alwaysPreparedSpells || []),
    ],
  };
}

export function hasSpellcastingProfile(profile) {
  return Boolean(
    normalizeProgression(profile?.casterProgression)
    || profile?.cantripKnown
    || profile?.cantripProgression
    || profile?.spellsKnown
    || profile?.preparedSpellsProgression
    || profile?.alwaysKnownSpells?.length
    || profile?.alwaysPreparedSpells?.length
  );
}

function addLimit(a, b) {
  if (b == null) return a;
  return Number(a || 0) + Number(b || 0);
}

function clampLevel(level) {
  return Math.max(1, Math.min(20, Number(level || 1)));
}

function casterContribution(prog, level) {
  if (prog === 'full') return level;
  if (prog === 'half') return Math.floor(level / 2);
  if (prog === 'artificer') return Math.ceil(level / 2);
  if (prog === 'third') return Math.floor(level / 3);
  return 0;
}

function pactSlots(level) {
  const row = PACT_SLOTS[Math.min(level, 20)] || {};
  return { count: row.slots || row.n || 0, level: row.level || row.l || 1 };
}

export function normalizeProgression(value) {
  const v = String(value || '').toLowerCase();
  if (v === '1/2') return 'half';
  if (v === '1/3') return 'third';
  return v;
}

export function getMaxLearnableSpellLevelForEntity(entity) {
  const profile = getSpellcastingProfile(entity);
  const level = clampLevel(entity?.level);
  const prog = normalizeProgression(profile.casterProgression);
  if (prog === 'pact') return Math.max(0, Number(pactSlots(level).level || 0));
  if (prog === 'full') return getMaxCastableSpellLevel({ regular: FULL_SLOTS[level] || [] });
  if (prog === 'half') return getMaxCastableSpellLevel({ regular: HALF_SLOTS[level] || [] });
  if (prog === 'third') return getMaxCastableSpellLevel({ regular: THIRD_SLOTS[level] || [] });
  if (prog === 'artificer') return getMaxCastableSpellLevel({ regular: HALF_SLOTS[level] || [] });
  return 0;
}

export function getCastBadge(spell) {
  const unit = spell?.time?.[0]?.unit || '';
  if (unit === 'bonus') return { label: 'BA', color: '#f5c542' };
  if (unit === 'reaction') return { label: 'RE', color: '#f5a623' };
  if (unit === 'action' || unit === '') return { label: 'A', color: '#4d95d6' };
  return { label: unit, color: '#c4b393' };
}

export function getMetaLine(spell) {
  const time = spell?.time?.[0] ? `${spell.time[0].number || 1} ${spell.time[0].unit}` : '';
  const range = formatSpellField(spell?.range);
  const components = formatComponents(spell?.components);
  const duration = formatSpellField(spell?.duration);
  return [time, range, components, duration].filter(Boolean).join(' - ');
}

function formatComponents(components) {
  if (!components || typeof components !== 'object') return '';
  return [components.v ? 'V' : null, components.s ? 'S' : null, components.m ? 'M' : null].filter(Boolean).join(', ');
}

function formatSpellField(value) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(formatSpellField).filter(Boolean).join(', ');
  if (typeof value === 'object') {
    if (value.type && value.amount) return `${value.amount} ${value.type}`;
    if (value.distance) return formatSpellField(value.distance);
    if (value.unit && value.number) return `${value.number} ${value.unit}`;
    if (value.type) return String(value.type);
  }
  return '';
}

export function renderEntries(entries) {
  return renderSafeEntries(entries);
}

export function toSnapshot(spell) {
  return {
    name: spell.name,
    level: spell.level ?? 0,
    school: spell.school,
    source: spell.source,
    components: spell.components,
    duration: spell.duration,
    range: spell.range,
    time: spell.time,
    ritual: !!spell.ritual,
    concentration: !!spell.concentration,
    entries: spell.entries || [],
    entriesHigherLevel: spell.entriesHigherLevel || null,
    scalingLevelDice: spell.scalingLevelDice || null,
    spellAttack: spell.spellAttack || null,
    damageInflict: spell.damageInflict || null,
  };
}

export function upsertSnapshot(snapshots, snapshot) {
  const idx = snapshots.findIndex((entry) => norm(entry.name) === norm(snapshot.name));
  if (idx >= 0) return snapshots.map((entry, index) => (index === idx ? { ...entry, ...snapshot } : entry));
  return [...snapshots, snapshot];
}

function parseDice(formula) {
  const match = String(formula).match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/);
  if (!match) return null;
  return { count: parseInt(match[1]), faces: parseInt(match[2]), mod: match[3] ? parseInt(match[3]) : 0 };
}

function formatDice(count, faces, mod) {
  let s = `${count}d${faces}`;
  if (mod) s += `${mod > 0 ? '+' : ''}${mod}`;
  return s;
}

export function computeScaledFormula(baseFormula, stepFormula, steps) {
  const b = parseDice(baseFormula);
  const s = parseDice(stepFormula);
  if (!b || !s) return baseFormula;
  return formatDice(b.count + s.count * steps, b.faces, b.mod);
}

export function getUpcastStep(entries) {
  const text = JSON.stringify(entries);
  const m = text.match(/\{@scaled(?:amage|ice)\s+(\d+d\d+)\|(\d+-\d+)\|(\d+d\d+)\}/);
  if (m) return { stepDie: m[3], range: m[2], display: m[1] };
  const m2 = text.match(/\{@scaled(?:amage|ice)\s+(\d+d\d+)\|(\d+-\d+)\}/);
  if (m2) return { stepDie: m2[1], range: m2[2], display: m2[1] };
  return null;
}

export function extractDamageDice(entries) {
  const out = [];
  const seen = new Set();
  const walk = (node) => {
    if (!node) return;
    if (typeof node === 'string') {
      node.replace(/\{@damage ([^}]+)\}/g, (_, inner) => {
        const formula = inner.trim().replace(/\s+/g, '');
        if (!seen.has(formula)) { seen.add(formula); out.push({ formula, label: formula }); }
        return '';
      });
      return;
    }
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (typeof node === 'object') {
      Object.values(node).forEach(walk);
    }
  };
  walk(entries);
  return out;
}

export function formatBonus(value) {
  return value >= 0 ? `+${value}` : String(value);
}

function sortByName(a, b) {
  return String(a.name).localeCompare(String(b.name));
}

export function dedupeSpells(spells) {
  const seen = new Set();
  return (spells || []).filter((spell) => {
    const key = norm(spell?.name);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function norm(value) {
  return String(value || '').toLowerCase();
}
