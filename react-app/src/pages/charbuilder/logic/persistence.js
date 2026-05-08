import { SHEET_KEYS } from '../constants.js';
import { calcMaxHp, getAllFinalScores, getPrimaryClassLevel, getSelectedFeatNames } from './calculations.js';
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
  const spellNames = [
    ...(character.selectedCantrips || []),
    ...Object.values(character.selectedSpells || {}).flat(),
  ];
  const spellSnapshots = spellNames
    .map((name) => data.spells.find((spell) => spell.name === name))
    .filter(Boolean)
    .map((spell) => ({
      name: spell.name,
      level: spell.level,
      school: spell.school,
      source: spell.source,
      components: spell.components,
      duration: spell.duration,
      range: spell.range,
      ritual: spell.ritual,
      concentration: spell.concentration,
      entries: spell.entries,
    }));

  return {
    name: character.name,
    level: character.level,
    classLevel: getPrimaryClassLevel(character),
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
      classActions: installedRegistry.getClassSheetActions(character.className),
      classResources: installedRegistry.getClassSheetResources(character.className),
      classEffects: installedRegistry.getClassSheetEffects(character.className),
      subclassActions: installedRegistry.getSubclassSheetActions(character.className, character.subclassShortName),
      subclassResources: installedRegistry.getSubclassSheetResources(character.className, character.subclassShortName),
      subclassEffects: installedRegistry.getSubclassSheetEffects(character.className, character.subclassShortName),
      speciesActions: installedRegistry.getSpeciesSheetActions(character.speciesName, character.speciesSource),
      speciesResources: installedRegistry.getSpeciesSheetResources(character.speciesName, character.speciesSource),
      speciesEffects: installedRegistry.getSpeciesSheetEffects(character.speciesName, character.speciesSource),
      featActions: getSelectedFeatNames(character).flatMap((feat) => installedRegistry.getFeatSheetActions(feat)),
      featResources: getSelectedFeatNames(character).flatMap((feat) => installedRegistry.getFeatSheetResources(feat)),
      featEffects: getSelectedFeatNames(character).flatMap((feat) => installedRegistry.getFeatSheetEffects(feat)),
    },
    selectedCantrips: character.selectedCantrips || [],
    selectedSpells: character.selectedSpells || {},
    wizardSpellbook: character.wizardSpellbook || {},
    wizardSpellMastery: character.wizardSpellMastery || {},
    wizardSignatureSpells: character.wizardSignatureSpells || {},
    autoGrantedSpells: [],
    xp: character.xp || 0,
    maxHp: calcMaxHp(character),
    finalScores: getAllFinalScores(character),
    inventory: character.inventory || [],
    currency: character.currency || { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
    grantSpellNames: [],
    spellSnapshots,
  };
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
