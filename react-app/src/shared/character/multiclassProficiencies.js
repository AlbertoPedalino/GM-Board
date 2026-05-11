const XPHB_MULTICLASS_FALLBACK = {
  Barbarian: {
    armor: ['shield'],
    weapons: ['martial'],
  },
  Bard: {
    armor: ['light'],
    tools: ['Choose one {@item Musical Instrument|XPHB}'],
    toolProficiencies: [{ anyMusicalInstrument: 1 }],
    skills: [{ choose: { from: 'classSkillList', count: 1 } }],
  },
  Cleric: {
    armor: ['light', 'medium', 'shield'],
  },
  Druid: {
    armor: ['light', 'shield'],
  },
  Fighter: {
    armor: ['light', 'medium', 'shield'],
    weapons: ['martial'],
  },
  Monk: {},
  Paladin: {
    armor: ['light', 'medium', 'shield'],
    weapons: ['martial'],
  },
  Ranger: {
    armor: ['light', 'medium', 'shield'],
    weapons: ['martial'],
    skills: [{ choose: { from: 'classSkillList', count: 1 } }],
  },
  Rogue: {
    armor: ['light'],
    tools: ["{@item Thieves' Tools|XPHB}"],
    toolProficiencies: [{ "thieves' tools": true }],
    skills: [{ choose: { from: 'classSkillList', count: 1 } }],
  },
  Sorcerer: {},
  Warlock: {
    armor: ['light'],
  },
  Wizard: {},
};

const MUSICAL_INSTRUMENTS = ['Bagpipes', 'Drum', 'Dulcimer', 'Flute', 'Hand Drum', 'Horn', 'Lute', 'Lyre', 'Pan Flute', 'Shawm', 'Viol'];

function classKey(className) {
  return String(className || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function fallbackForClass(className) {
  const wanted = classKey(className);
  return Object.entries(XPHB_MULTICLASS_FALLBACK).find(([name]) => classKey(name) === wanted)?.[1] || {};
}

export function isPrimaryClassContext(ctx = {}) {
  return !isMulticlassContext(ctx);
}

export function isMulticlassContext(ctx = {}) {
  return !!(ctx.isMulticlass || ctx.multiclass || ctx.keyPrefix || String(ctx.keyPrefix || '').startsWith('mc'));
}

export function getMulticlassProficiencies(className, cls = null) {
  return cls?.multiclassing?.proficienciesGained
    || cls?.multiclassProficienciesGained
    || fallbackForClass(className);
}

function classSkillList(cls) {
  const out = [];
  (cls?.startingProficiencies?.skills || []).forEach((block) => {
    const from = block?.choose?.from || [];
    if (Array.isArray(from)) out.push(...from);
  });
  return [...new Set(out)].filter(Boolean);
}

function choiceFromBlock(key, label, block, fallbackFrom = []) {
  if (!block || typeof block !== 'object') return null;
  const choose = block.choose;
  if (!choose) return null;
  let from = choose.from;
  if (from === 'classSkillList') from = fallbackFrom;
  if (!Array.isArray(from) || !from.length) from = fallbackFrom;
  const count = Number(choose.count || block.anyMusicalInstrument || block.any || 1);
  if (!from.length || !count) return null;
  return { key, label, type: 'generic_choice', from, count, level: 1 };
}

export function getMulticlassChoiceSpecs(className, keyPrefix = '', cls = null) {
  const profs = getMulticlassProficiencies(className, cls);
  const specs = [];

  (profs?.skills || []).forEach((block, index) => {
    const spec = choiceFromBlock(`${keyPrefix}mc_skill_${index}`, 'Multiclass Skill', block, classSkillList(cls));
    if (spec) specs.push({ ...spec, type: 'skill_choice' });
  });

  [...(profs?.toolProficiencies || [])].forEach((block, index) => {
    const spec = block?.anyMusicalInstrument
      ? { key: `${keyPrefix}mc_tool_${index}`, label: 'Multiclass Tool', type: 'generic_choice', from: MUSICAL_INSTRUMENTS, count: Number(block.anyMusicalInstrument || 1), level: 1 }
      : choiceFromBlock(`${keyPrefix}mc_tool_${index}`, 'Multiclass Tool', block, []);
    if (spec) specs.push(spec);
  });

  return specs;
}
