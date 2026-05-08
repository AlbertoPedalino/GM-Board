import { SHEET_KEYS } from '../constants.js';
import { calcMaxHp, getAllFinalScores, getPrimaryClassLevel, getSelectedFeatNames } from './calculations.js';
import { getMod, getFinal } from '../../charsheet/logic/calculations.js';
import { installedRegistry } from '../../../adapters/index.js';

export function extractSheetData(text) {
  try {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    const tag = doc.getElementById('gb-sheet-payload');
    if (tag?.textContent) {
      const payload = JSON.parse(tag.textContent);
      if (payload?.type === 'gb-sheet-import' && payload.data) return payload.data;
    }
  } catch (_) {}
  const match = text.match(/var\s+d\s*=\s*(\{[\s\S]+\})\s*;\s*var\s+k\s*=/);
  if (match) {
    try { return JSON.parse(match[1]); } catch (_) {}
  }
  try {
    const json = JSON.parse(text);
    return json?.data || json;
  } catch (_) {
    return null;
  }
}

export function makeSheetPayload(character, data) {
  const primaryClassLevel = getPrimaryClassLevel(character);
  const selectedSpellLevels = new Map();
  (character.selectedCantrips || []).forEach((name) => selectedSpellLevels.set(name, 0));
  Object.entries(character.selectedSpells || {}).forEach(([level, names]) => {
    (names || []).forEach((name) => selectedSpellLevels.set(name, Number(level)));
  });
  (character.extraClasses || []).forEach((extra) => {
    (extra.selectedCantrips || []).forEach((name) => selectedSpellLevels.set(name, 0));
    Object.entries(extra.selectedSpells || {}).forEach(([level, names]) => {
      (names || []).forEach((name) => selectedSpellLevels.set(name, Number(level)));
    });
  });
  const choiceSpellNames = [];
  Object.entries(character.choices || {}).forEach(([key, value]) => {
    const values = Array.isArray(value) ? value : [value];
    values.forEach((entry) => {
      if (typeof entry !== 'string') return;
      const name = entry.split('|')[0].trim();
      if (!name) return;
      const knownSpell = data.spells.some((spell) => spell.name === name);
      const spellChoiceKey = /(spell|cantrip|tome|magical|known|prepared|innate|expanded)/i.test(key);
      if ((knownSpell || spellChoiceKey) && !['str', 'dex', 'con', 'int', 'wis', 'cha'].includes(name.toLowerCase())) choiceSpellNames.push(name);
    });
  });
  const autoGrantedSpells = collectAutoGrantedSpells(character);
  const spellNames = [
    ...(character.selectedCantrips || []),
    ...Object.values(character.selectedSpells || {}).flat(),
    ...(character.extraClasses || []).flatMap((extra) => [
      ...(extra.selectedCantrips || []),
      ...Object.values(extra.selectedSpells || {}).flat(),
    ]),
    ...choiceSpellNames,
    ...autoGrantedSpells.map((spell) => spell.name),
  ];
  const spellSnapshots = [...new Set(spellNames)]
    .map((name) => {
      const spell = data.spells.find((entry) => entry.name === name);
      if (spell) return spell;
      return { name, level: selectedSpellLevels.get(name) ?? autoGrantedSpells.find((entry) => entry.name === name)?.level ?? 0 };
    })
    .map((spell) => ({
      name: spell.name,
      level: Number(spell.level ?? selectedSpellLevels.get(spell.name) ?? 0),
      school: spell.school,
      source: spell.source,
      components: spell.components,
      duration: spell.duration,
      range: spell.range,
      time: spell.time,
      ritual: spell.ritual,
      concentration: spell.concentration,
      entries: spell.entries,
      entriesHigherLevel: spell.entriesHigherLevel || null,
      scalingLevelDice: spell.scalingLevelDice || null,
      spellAttack: spell.spellAttack || null,
      damageInflict: spell.damageInflict || null,
    }));

  const annotateActions = (actions, ownerName, ownerLevel, ownerType) => (
    (actions || []).map((action) => ({
      ...action,
      ownerName, ownerLevel, ownerType,
      healFormula: typeof action.healFormula === 'function'
        ? action.healFormula({ character, ownerLevel })
        : action.healFormula,
      damageFormula: typeof action.damageFormula === 'function'
        ? action.damageFormula({ character, ownerLevel })
        : action.damageFormula,
      damageButtonLabel: typeof action.damageButtonLabel === 'function'
        ? action.damageButtonLabel({ character, ownerLevel })
        : action.damageButtonLabel,
    }))
  );
  const characterMods = {};
  ['str','dex','con','int','wis','cha'].forEach(stat => {
    characterMods[stat] = Number(getMod(getFinal(character, stat)) || 0);
  });
  const annotateResources = (resources, ownerName, ownerLevel, ownerType) => (
    (resources || []).map((resource) => ({
      ...resource,
      ownerName,
      ownerLevel,
      ownerType,
      maxComputed: typeof resource.max === 'function' ? resource.max(ownerLevel, characterMods) : resource.max,
    }))
  );
  const extraClasses = character.extraClasses || [];
  const runtimeClassActions = [
    ...annotateActions(installedRegistry.getClassSheetActions(character.className), character.className, primaryClassLevel, 'class'),
    ...extraClasses.flatMap((extra) => annotateActions(installedRegistry.getClassSheetActions(extra.name), extra.name, Number(extra.level || 1), 'class')),
  ];
  const runtimeClassResources = [
    ...annotateResources(installedRegistry.getClassSheetResources(character.className), character.className, primaryClassLevel, 'class'),
    ...extraClasses.flatMap((extra) => annotateResources(installedRegistry.getClassSheetResources(extra.name), extra.name, Number(extra.level || 1), 'class')),
  ];
  const runtimeSubclassActions = [
    ...annotateActions(installedRegistry.getSubclassSheetActions(character.className, character.subclassShortName), character.subclassShortName || character.className, primaryClassLevel, 'subclass'),
    ...extraClasses.flatMap((extra) => annotateActions(installedRegistry.getSubclassSheetActions(extra.name, extra.subclassShortName), extra.subclassShortName || extra.name, Number(extra.level || 1), 'subclass')),
  ];
  const runtimeSubclassResources = [
    ...annotateResources(installedRegistry.getSubclassSheetResources(character.className, character.subclassShortName), character.subclassShortName || character.className, primaryClassLevel, 'subclass'),
    ...extraClasses.flatMap((extra) => annotateResources(installedRegistry.getSubclassSheetResources(extra.name, extra.subclassShortName), extra.subclassShortName || extra.name, Number(extra.level || 1), 'subclass')),
  ];

  return {
    name: character.name,
    level: character.level,
    classLevel: primaryClassLevel,
    className: character.className,
    classSource: character.classSource,
    subclassShortName: character.subclassShortName || null,
    extraClasses: character.extraClasses || [],
    speciesName: character.speciesName,
    speciesSource: character.speciesSource,
    bgName: character.backgroundName,
    bgSource: character.backgroundSource,
    bgAbility: character.backgroundAbilities,
    scoreMethod: character.scoreMethod,
    hpMode: character.hpMode || 'average',
    hpManualRolls: { ...(character.hpManualRolls || {}) },
    pbScores: { ...character.pbScores },
    arrAssign: { ...character.arrAssign },
    diceAssign: { ...character.diceAssign },
    manualScores: { ...character.manualScores },
    choices: { ...(character.choices || {}) },
    selectedSkills: character.selectedSkills || [],
    selectedLanguages: character.selectedLanguages || [],
    selectedTools: character.selectedTools || [],
    clsSnapshot: {
      hd: character.cls?.hd,
      proficiency: character.cls?.proficiency || [],
      casterProgression: character.cls?.casterProgression || null,
      preparedSpellsProgression: character.cls?.preparedSpellsProgression || null,
      cantripProgression: character.cls?.cantripProgression || null,
      subclassLevel: character.cls?.subclassLevel || 3,
      subclassTitle: character.cls?.subclassTitle || '',
      startingProficiencies: character.cls?.startingProficiencies || {},
      startingEquipment: character.cls?.startingEquipment || null,
    },
    speciesSnapshot: {
      speed: character.speciesObj?.speed || 30,
      size: character.speciesObj?.size || ['M'],
      darkvision: character.speciesObj?.darkvision || 0,
      resist: character.speciesObj?.resist || [],
      immune: character.speciesObj?.immune || [],
      entries: character.speciesObj?.entries || [],
    },
    bgSnapshot: {
      skillProficiencies: character.backgroundObj?.skillProficiencies || [],
      languageProficiencies: character.backgroundObj?.languageProficiencies || [],
      toolProficiencies: character.backgroundObj?.toolProficiencies || [],
      feats: character.backgroundObj?.feats || [],
      startingEquipment: character.backgroundObj?.startingEquipment || null,
      entries: character.backgroundObj?.entries || [],
    },
    allFeatSnapshots: (data.feats || [])
      .filter((feat) => getSelectedFeatNames(character).includes(feat.name))
      .map((feat) => ({
        name: feat.name,
        source: feat.source,
        category: feat.category,
        categories: feat.categories,
        entries: feat.entries,
        prerequisite: feat.prerequisite,
      })),
    allClassFeatures: character.allFeatures || [],
    allSubFeatures: character.allSubFeatures || [],
    adapterRuntime: {
      classActions: runtimeClassActions,
      classResources: runtimeClassResources,
      classEffects: installedRegistry.getClassSheetEffects(character.className),
      subclassActions: runtimeSubclassActions,
      subclassResources: runtimeSubclassResources,
      subclassEffects: installedRegistry.getSubclassSheetEffects(character.className, character.subclassShortName),
      speciesActions: installedRegistry.getSpeciesSheetActions(character.speciesName, character.speciesSource),
      speciesResources: (installedRegistry.getSpeciesSheetResources(character.speciesName, character.speciesSource) || []).map(r => ({ ...r, maxComputed: typeof r.max === 'function' ? r.max(character.level, characterMods) : r.max })),
      speciesEffects: installedRegistry.getSpeciesSheetEffects(character.speciesName, character.speciesSource),
      featActions: getSelectedFeatNames(character).flatMap((feat) => installedRegistry.getFeatSheetActions(feat)),
      featResources: getSelectedFeatNames(character).flatMap((feat) => (installedRegistry.getFeatSheetResources(feat) || []).map(r => ({ ...r, maxComputed: typeof r.max === 'function' ? r.max(character.level, characterMods) : r.max }))),
      featEffects: getSelectedFeatNames(character).flatMap((feat) => installedRegistry.getFeatSheetEffects(feat)),
    },
    selectedCantrips: character.selectedCantrips || [],
    selectedSpells: character.selectedSpells || {},
    wizardSpellbook: character.wizardSpellbook || {},
    wizardSpellMastery: character.wizardSpellMastery || {},
    wizardSignatureSpells: character.wizardSignatureSpells || {},
    autoGrantedSpells,
    xp: character.xp || 0,
    maxHp: calcMaxHp(character),
    finalScores: getAllFinalScores(character),
    inventory: character.inventory || [],
    currency: character.currency || { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
    grantSpellNames: choiceSpellNames,
    spellSnapshots,
  };
}

function collectAutoGrantedSpells(character) {
  const out = [];
  const pushCfg = (cfg, source, sourceType, level) => {
    [...(cfg?.spellcasting?.alwaysKnownSpells || []), ...(cfg?.spellcasting?.alwaysPreparedSpells || [])].forEach((entry) => {
      const name = typeof entry === 'string' ? entry : entry?.name;
      if (!name || level < Number(entry?.minLevel || 1)) return;
      if (!out.some((spell) => spell.name === name && spell.source === source)) out.push({ name, source, sourceType, level: entry?.level });
    });
  };

  const primaryLevel = getPrimaryClassLevel(character);
  pushCfg(installedRegistry.getClassRuntimeConfig(character.className), character.className || 'Class', 'class', primaryLevel);
  pushCfg(installedRegistry.getSubclassRuntimeConfig(character.className, character.subclassShortName), character.subclassShortName || 'Subclass', 'subclass', primaryLevel);

  (character.extraClasses || []).forEach((extra) => {
    const level = Number(extra.level || 1);
    pushCfg(installedRegistry.getClassRuntimeConfig(extra.name), extra.name || 'Class', 'class', level);
    pushCfg(installedRegistry.getSubclassRuntimeConfig(extra.name, extra.subclassShortName), extra.subclassShortName || 'Subclass', 'subclass', level);
  });

  return out;
}

export function saveCharacter(character, data) {
  const payload = makeSheetPayload(character, data);
  localStorage.setItem('5e_current_char', JSON.stringify(payload));
  localStorage.setItem('5e_inventory', JSON.stringify(character.inventory || []));
  localStorage.setItem('5e_currency', JSON.stringify(character.currency || {}));
  localStorage.setItem('5e_xp', String(character.xp || 0));
  localStorage.setItem('5e_builder_state', JSON.stringify(character));
  return payload;
}

export function importSheetPayload(payload, confirmOverwrite = () => true) {
  if (!payload || typeof payload !== 'object') throw new Error('Formato file non riconosciuto');
  const allowed = new Set(SHEET_KEYS);
  const hasExisting = localStorage.getItem('5e_builder_state') != null;
  if (hasExisting && !confirmOverwrite()) return 0;
  SHEET_KEYS.forEach((key) => localStorage.removeItem(key));
  let count = 0;
  Object.entries(payload).forEach(([key, value]) => {
    if (allowed.has(key) && typeof value === 'string') {
      localStorage.setItem(key, value);
      count += 1;
    }
  });
  if (!count) throw new Error('Nessun dato valido trovato');
  return count;
}
