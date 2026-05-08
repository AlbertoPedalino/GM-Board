import 'adapters/index.js';
import { createContext, useContext, useReducer, useCallback } from 'react';

const BASE = 'https://raw.githubusercontent.com/5etools-mirror-3/5etools-src/main/data/';
const ALLOWED = ['XPHB', 'FRAiF', 'FRHoF', 'EFA'];

const CLASS_FILES = [
  'class-barbarian.json', 'class-bard.json', 'class-cleric.json',
  'class-druid.json', 'class-fighter.json', 'class-monk.json',
  'class-paladin.json', 'class-ranger.json', 'class-rogue.json',
  'class-sorcerer.json', 'class-warlock.json', 'class-wizard.json',
  'class-artificer.json',
];

const SPELL_FILES = [
  'spells-archetypes.json', 'spells-classes.json',
  'spells-subclasses.json', 'spells-racial.json',
];

const INIT_CHAR = {
  name: '', level: 1, className: null, classSource: null, cls: null,
  classes: [], allFeatures: [], subclasses: [], allSubFeatures: [], subclassShortName: null,
  speciesName: null, speciesSource: null, speciesObj: null,
  bgName: null, bgSource: null, bgObj: null, bgAbility: [], bgPatternIdx: 0,
  scoreMethod: 'pointbuy',
  hpMode: 'average', hpManualRolls: {},
  pbScores: { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 },
  arrAssign: { str: null, dex: null, con: null, int: null, wis: null, cha: null },
  dicePool: [], diceAssign: { str: null, dex: null, con: null, int: null, wis: null, cha: null },
  manualScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  choices: {}, equipChoices: {},
  selectedCantrips: [], selectedSpells: {},
  wizardSpellbook: {}, wizardSpellMastery: {}, wizardSignatureSpells: {},
  xp: 0, inventory: [], currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
};

function makeInitState() {
  return {
    char: { ...INIT_CHAR, pbScores: { ...INIT_CHAR.pbScores }, arrAssign: { ...INIT_CHAR.arrAssign }, diceAssign: { ...INIT_CHAR.diceAssign }, manualScores: { ...INIT_CHAR.manualScores }, currency: { ...INIT_CHAR.currency } },
    activeTab: 1,
    classCache: {},
    allSpecies: [],
    allBgs: [],
    allFeats: [],
    spellDb: [],
    allItemsDb: [],
    loading: { classes: false, species: false, backgrounds: false, feats: false, spells: false, items: false },
  };
}

function statCopy(s) {
  return { str: s.str, dex: s.dex, con: s.con, int: s.int, wis: s.wis, cha: s.cha };
}

function reducer(state, action) {
  const c = state.char;
  switch (action.type) {
    case 'SET_CHAR_NAME': {
      return { ...state, char: { ...c, name: action.name } };
    }
    case 'SELECT_CLASS': {
      const { name, source } = action;
      const entry = state.classCache[name];
      if (!entry) return state;
      const cls = entry.class || null;
      const subclasses = entry.subclasses || [];
      const classes = c.classes.filter(cl => cl.name !== name);
      classes.push({ name, source, level: c.level });
      return {
        ...state,
        char: {
          ...c, className: name, classSource: source, cls,
          classes, allFeatures: cls ? cls._featureRefs || [] : [],
          subclasses, allSubFeatures: [], subclassShortName: null,
          selectedCantrips: [], selectedSpells: {},
          wizardSpellbook: {}, wizardSpellMastery: {}, wizardSignatureSpells: {},
        },
      };
    }
    case 'SELECT_LEVEL': {
      const n = Math.max(1, Math.min(20, action.level));
      const classes = c.classes.map((cl, i) => {
        if (cl.name === c.className) return { ...cl, level: n };
        return cl;
      });
      const cls = c.cls;
      const features = cls ? cls._featureRefs || [] : [];
      return {
        ...state,
        char: {
          ...c, level: n, classes,
          allFeatures: features.filter(f => f.level <= n),
        },
      };
    }
    case 'SELECT_SUBCLASS': {
      const { shortName } = action;
      if (c.subclassShortName === shortName) {
        return { ...state, char: { ...c, subclassShortName: null, allSubFeatures: [] } };
      }
      const sub = c.subclasses.find(s => s.shortName === shortName || s.name === shortName);
      const features = sub ? sub._featureRefs || [] : [];
      return {
        ...state,
        char: { ...c, subclassShortName: shortName, allSubFeatures: features.filter(f => f.level <= c.level) },
      };
    }
    case 'SELECT_SPECIES': {
      const { name, source } = action;
      const sp = state.allSpecies.find(s => s.name === name && (!source || s.source === source));
      return {
        ...state,
        char: { ...c, speciesName: name, speciesSource: source || (sp && sp.source) || null, speciesObj: sp || null },
      };
    }
    case 'SELECT_BG': {
      const { name, source } = action;
      const bg = state.allBgs.find(b => b.name === name && (!source || b.source === source));
      return {
        ...state,
        char: { ...c, bgName: name, bgSource: source || (bg && bg.source) || null, bgObj: bg || null, bgAbility: [], bgPatternIdx: 0 },
      };
    }
    case 'SET_BG_ABILITY': {
      return { ...state, char: { ...c, bgAbility: action.arr } };
    }
    case 'SET_BG_PATTERN_IDX': {
      return { ...state, char: { ...c, bgPatternIdx: action.idx } };
    }
    case 'SET_SCORE_METHOD': {
      return { ...state, char: { ...c, scoreMethod: action.method } };
    }
    case 'SET_HP_MODE': {
      return { ...state, char: { ...c, hpMode: action.mode } };
    }
    case 'SET_HP_MANUAL_ROLL': {
      const rolls = { ...c.hpManualRolls, [action.level]: action.value };
      return { ...state, char: { ...c, hpManualRolls: rolls } };
    }
    case 'SET_PB_SCORE': {
      const s = statCopy(c.pbScores);
      const val = Math.max(3, Math.min(18, action.value));
      s[action.stat] = val;
      return { ...state, char: { ...c, pbScores: s } };
    }
    case 'SET_ARR_ASSIGN': {
      const s = { ...c.arrAssign };
      s[action.stat] = action.value;
      return { ...state, char: { ...c, arrAssign: s } };
    }
    case 'SET_DICE_POOL': {
      return { ...state, char: { ...c, dicePool: action.pool } };
    }
    case 'SET_DICE_ASSIGN': {
      const s = { ...c.diceAssign };
      s[action.stat] = action.value;
      return { ...state, char: { ...c, diceAssign: s } };
    }
    case 'SET_MANUAL_SCORE': {
      const s = statCopy(c.manualScores);
      const val = Math.max(3, Math.min(30, action.value));
      s[action.stat] = val;
      return { ...state, char: { ...c, manualScores: s } };
    }
    case 'TOGGLE_CHOICE': {
      const choices = { ...c.choices };
      const key = action.key;
      const val = action.value;
      const current = choices[key];
      if (Array.isArray(current)) {
        const idx = current.indexOf(val);
        if (idx >= 0) {
          const next = current.filter(v => v !== val);
          if (next.length) choices[key] = next;
          else delete choices[key];
        } else {
          choices[key] = [...current, val];
        }
      } else {
        if (current === val) delete choices[key];
        else choices[key] = val;
      }
      return { ...state, char: { ...c, choices } };
    }
    case 'SELECT_CHOICE': {
      const choices = { ...c.choices, [action.key]: action.value };
      return { ...state, char: { ...c, choices } };
    }
    case 'SET_CHOICES': {
      return { ...state, char: { ...c, choices: { ...c.choices, ...action.payload } } };
    }
    case 'SET_EQUIP_CHOICES': {
      return { ...state, char: { ...c, equipChoices: { ...c.equipChoices, ...action.payload } } };
    }
    case 'TOGGLE_CANTRIP': {
      const list = c.selectedCantrips.includes(action.name)
        ? c.selectedCantrips.filter(n => n !== action.name)
        : [...c.selectedCantrips, action.name];
      return { ...state, char: { ...c, selectedCantrips: list } };
    }
    case 'TOGGLE_SPELL': {
      const map = { ...c.selectedSpells };
      const level = action.level;
      const name = action.name;
      const arr = Array.isArray(map[level]) ? [...map[level]] : [];
      const idx = arr.indexOf(name);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(name);
      if (arr.length) map[level] = arr;
      else delete map[level];
      return { ...state, char: { ...c, selectedSpells: map } };
    }
    case 'SET_WIZARD_SPELLBOOK': {
      return { ...state, char: { ...c, wizardSpellbook: action.data } };
    }
    case 'SET_WIZARD_SPELL_MASTERY': {
      return { ...state, char: { ...c, wizardSpellMastery: action.data } };
    }
    case 'SET_WIZARD_SIGNATURE_SPELLS': {
      return { ...state, char: { ...c, wizardSignatureSpells: action.data } };
    }
    case 'SET_XP': {
      return { ...state, char: { ...c, xp: Math.max(0, action.val) } };
    }
    case 'ADD_INVENTORY_ITEM': {
      return { ...state, char: { ...c, inventory: [...c.inventory, action.item] } };
    }
    case 'REMOVE_INVENTORY_ITEM': {
      const inv = c.inventory.filter((_, i) => i !== action.idx);
      return { ...state, char: { ...c, inventory: inv } };
    }
    case 'UPDATE_CURRENCY': {
      const cur = { ...c.currency, [action.type_]: Math.max(0, action.val) };
      return { ...state, char: { ...c, currency: cur } };
    }
    case 'SET_ACTIVE_TAB': {
      return { ...state, activeTab: Math.max(1, Math.min(7, action.n)) };
    }
    case 'SET_LOADING': {
      return { ...state, loading: { ...state.loading, ...action.payload } };
    }
    case 'SET_CLASS_CACHE': {
      return { ...state, classCache: { ...state.classCache, ...action.payload } };
    }
    case 'SET_ALL_SPECIES': {
      return { ...state, allSpecies: action.payload };
    }
    case 'SET_ALL_BGS': {
      return { ...state, allBgs: action.payload };
    }
    case 'SET_ALL_FEATS': {
      return { ...state, allFeats: action.payload };
    }
    case 'SET_SPELL_DB': {
      return { ...state, spellDb: action.payload };
    }
    case 'SET_ALL_ITEMS_DB': {
      return { ...state, allItemsDb: action.payload };
    }
    case 'RESTORE_CHAR': {
      return { ...state, char: { ...state.char, ...action.payload } };
    }
    default:
      return state;
  }
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.json();
}

function isAllowed(source) {
  return ALLOWED.includes(String(source || '').trim());
}

function filterByAllowed(arr) {
  return Array.isArray(arr) ? arr.filter(item => item && isAllowed(item.source)) : [];
}

async function loadAllClassData(dispatch, stateGetter) {
  dispatch({ type: 'SET_LOADING', payload: { classes: true } });
  try {
    const cache = {};
    for (const file of CLASS_FILES) {
      const url = `${BASE}class/${file}`;
      let data;
      try {
        data = await fetchJson(url);
      } catch {
        continue;
      }
      const rawClasses = Array.isArray(data.class) ? data.class : [];
      const rawSubs = Array.isArray(data.subclass) ? data.subclass : [];

      const adaptClasses = typeof window.adaptClassesDataset === 'function'
        ? window.adaptClassesDataset(rawClasses.filter(c => isAllowed(c.source)), { defaultSource: 'XPHB' })
        : rawClasses;
      const adaptSubs = typeof window.adaptSubclassesDataset === 'function'
        ? window.adaptSubclassesDataset(rawSubs.filter(s => isAllowed(s.source)), { defaultSource: 'XPHB' })
        : rawSubs;

      for (const cls of adaptClasses) {
        if (!cls || !cls.name) continue;
        const subs = adaptSubs.filter(s => s.className === cls.name);
        cache[cls.name] = { class: cls, subclasses: subs };
      }
    }
    dispatch({ type: 'SET_CLASS_CACHE', payload: cache });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: { classes: false } });
  }
}

async function fetchSpeciesData(dispatch) {
  dispatch({ type: 'SET_LOADING', payload: { species: true } });
  try {
    const raw = await fetchJson(`${BASE}races.json`);
    const rawArr = Array.isArray(raw.race) ? raw.race : (Array.isArray(raw) ? raw : []);
    const filtered = rawArr.filter(r => r && isAllowed(r.source));
    const adapted = typeof window.adaptSpeciesDataset === 'function'
      ? window.adaptSpeciesDataset(filtered, { defaultSource: 'XPHB' })
      : filtered;
    dispatch({ type: 'SET_ALL_SPECIES', payload: adapted });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: { species: false } });
  }
}

async function fetchBackgroundsData(dispatch) {
  dispatch({ type: 'SET_LOADING', payload: { backgrounds: true } });
  try {
    const raw = await fetchJson(`${BASE}backgrounds.json`);
    const rawArr = Array.isArray(raw.background) ? raw.background : (Array.isArray(raw) ? raw : []);
    const filtered = rawArr.filter(b => b && isAllowed(b.source));
    const adapted = typeof window.adaptBackgroundsDataset === 'function'
      ? window.adaptBackgroundsDataset(filtered, { defaultSource: 'XPHB' })
      : filtered;
    dispatch({ type: 'SET_ALL_BGS', payload: adapted });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: { backgrounds: false } });
  }
}

async function fetchFeatsData(dispatch) {
  dispatch({ type: 'SET_LOADING', payload: { feats: true } });
  try {
    const raw = await fetchJson(`${BASE}feats.json`);
    const rawArr = Array.isArray(raw.feat) ? raw.feat : (Array.isArray(raw) ? raw : []);
    const filtered = rawArr.filter(f => f && isAllowed(f.source));
    const adapted = typeof window.adaptFeatsDataset === 'function'
      ? window.adaptFeatsDataset(filtered, { allowedSources: ALLOWED })
      : filtered;
    dispatch({ type: 'SET_ALL_FEATS', payload: adapted });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: { feats: false } });
  }
}

async function fetchSpellsData(dispatch) {
  dispatch({ type: 'SET_LOADING', payload: { spells: true } });
  try {
    const allSpells = [];
    for (const file of SPELL_FILES) {
      try {
        const data = await fetchJson(`${BASE}spells/${file}`);
        const arr = Array.isArray(data.spell) ? data.spell : (Array.isArray(data) ? data : []);
        for (const spell of arr) {
          if (!spell || !spell.name) continue;
          const adapted = typeof window.adaptSpellRecord === 'function'
            ? window.adaptSpellRecord(spell, {})
            : spell;
          allSpells.push(adapted);
        }
      } catch {
        continue;
      }
    }
    dispatch({ type: 'SET_SPELL_DB', payload: allSpells.filter(s => s && isAllowed(s.source)) });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: { spells: false } });
  }
}

async function fetchItemsData(dispatch) {
  dispatch({ type: 'SET_LOADING', payload: { items: true } });
  try {
    const allItems = [];
    const itemFiles = ['items-base.json', 'items.json', 'magicvariants.json'];
    for (const file of itemFiles) {
      try {
        const data = await fetchJson(`${BASE}${file}`);
        const arr = Array.isArray(data.item) ? data.item : (Array.isArray(data) ? data : []);
        for (const item of arr) {
          if (!item || !item.name) continue;
          if (!isAllowed(item.source)) continue;
          const adapted = typeof window.adaptItemRecord === 'function'
            ? window.adaptItemRecord(item, {})
            : item;
          allItems.push(adapted);
        }
      } catch {
        continue;
      }
    }
    dispatch({ type: 'SET_ALL_ITEMS_DB', payload: allItems });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: { items: false } });
  }
}

function generateCharId() {
  return `pc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function buildCharSnapshot(char) {
  return {
    name: char.name,
    level: char.level,
    className: char.className,
    classSource: char.classSource,
    classLevel: char.level,
    subclassShortName: char.subclassShortName,
    speciesName: char.speciesName,
    speciesSource: char.speciesSource,
    bgName: char.bgName,
    bgSource: char.bgSource,
    bgAbility: char.bgAbility,
    bgPatternIdx: char.bgPatternIdx,
    scoreMethod: char.scoreMethod,
    hpMode: char.hpMode,
    hpManualRolls: char.hpManualRolls,
    pbScores: { ...char.pbScores },
    arrAssign: { ...char.arrAssign },
    dicePool: [...char.dicePool],
    diceAssign: { ...char.diceAssign },
    manualScores: { ...char.manualScores },
    choices: { ...char.choices },
    equipChoices: { ...char.equipChoices },
    selectedCantrips: [...char.selectedCantrips],
    selectedSpells: JSON.parse(JSON.stringify(char.selectedSpells)),
    wizardSpellbook: { ...char.wizardSpellbook },
    wizardSpellMastery: { ...char.wizardSpellMastery },
    wizardSignatureSpells: { ...char.wizardSignatureSpells },
    extraClasses: char.classes
      .filter(cl => cl.name !== char.className)
      .map(cl => ({ name: cl.name, level: cl.level })),
  };
}

function saveToLocalStorage(char, state) {
  const snapshot = buildCharSnapshot(char);
  localStorage.setItem('5e_current_char', JSON.stringify(snapshot));
  localStorage.setItem('5e_builder_state', JSON.stringify({
    activeTab: state.activeTab,
  }));
  localStorage.setItem('5e_inventory', JSON.stringify(char.inventory));
  localStorage.setItem('5e_currency', JSON.stringify(char.currency));
  localStorage.setItem('5e_xp', String(char.xp));
}

const CharbuilderContext = createContext(null);

export function CharbuilderProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, makeInitState);

  const setCharacterName = useCallback((name) => {
    dispatch({ type: 'SET_CHAR_NAME', name });
  }, []);

  const selectClass = useCallback((name, source) => {
    dispatch({ type: 'SELECT_CLASS', name, source });
  }, []);

  const selectLevel = useCallback((level) => {
    dispatch({ type: 'SELECT_LEVEL', level });
  }, []);

  const selectSubclass = useCallback((shortName) => {
    dispatch({ type: 'SELECT_SUBCLASS', shortName });
  }, []);

  const selectSpecies = useCallback((name, source) => {
    dispatch({ type: 'SELECT_SPECIES', name, source });
  }, []);

  const selectBg = useCallback((name, source) => {
    dispatch({ type: 'SELECT_BG', name, source });
  }, []);

  const setBgAbility = useCallback((arr) => {
    dispatch({ type: 'SET_BG_ABILITY', arr });
  }, []);

  const setBgPatternIdx = useCallback((idx) => {
    dispatch({ type: 'SET_BG_PATTERN_IDX', idx });
  }, []);

  const setScoreMethod = useCallback((method) => {
    dispatch({ type: 'SET_SCORE_METHOD', method });
  }, []);

  const setHpMode = useCallback((mode) => {
    dispatch({ type: 'SET_HP_MODE', mode });
  }, []);

  const setHpManualRoll = useCallback((level, value) => {
    dispatch({ type: 'SET_HP_MANUAL_ROLL', level, value });
  }, []);

  const setPbScore = useCallback((stat, value) => {
    dispatch({ type: 'SET_PB_SCORE', stat, value });
  }, []);

  const setArrAssign = useCallback((stat, value) => {
    dispatch({ type: 'SET_ARR_ASSIGN', stat, value });
  }, []);

  const setDicePool = useCallback((pool) => {
    dispatch({ type: 'SET_DICE_POOL', pool });
  }, []);

  const setDiceAssign = useCallback((stat, value) => {
    dispatch({ type: 'SET_DICE_ASSIGN', stat, value });
  }, []);

  const setManualScore = useCallback((stat, value) => {
    dispatch({ type: 'SET_MANUAL_SCORE', stat, value });
  }, []);

  const toggleChoice = useCallback((key, value) => {
    dispatch({ type: 'TOGGLE_CHOICE', key, value });
  }, []);

  const selectChoice = useCallback((key, value) => {
    dispatch({ type: 'SELECT_CHOICE', key, value });
  }, []);

  const setChoices = useCallback((payload) => {
    dispatch({ type: 'SET_CHOICES', payload });
  }, []);

  const setEquipChoices = useCallback((payload) => {
    dispatch({ type: 'SET_EQUIP_CHOICES', payload });
  }, []);

  const toggleCantrip = useCallback((name) => {
    dispatch({ type: 'TOGGLE_CANTRIP', name });
  }, []);

  const toggleSpell = useCallback((level, name) => {
    dispatch({ type: 'TOGGLE_SPELL', level, name });
  }, []);

  const setWizardSpellbook = useCallback((data) => {
    dispatch({ type: 'SET_WIZARD_SPELLBOOK', data });
  }, []);

  const setWizardSpellMastery = useCallback((data) => {
    dispatch({ type: 'SET_WIZARD_SPELL_MASTERY', data });
  }, []);

  const setWizardSignatureSpells = useCallback((data) => {
    dispatch({ type: 'SET_WIZARD_SIGNATURE_SPELLS', data });
  }, []);

  const setXp = useCallback((val) => {
    dispatch({ type: 'SET_XP', val });
  }, []);

  const addInventoryItem = useCallback((item) => {
    dispatch({ type: 'ADD_INVENTORY_ITEM', item });
  }, []);

  const removeInventoryItem = useCallback((idx) => {
    dispatch({ type: 'REMOVE_INVENTORY_ITEM', idx });
  }, []);

  const updateCurrency = useCallback((type_, val) => {
    dispatch({ type: 'UPDATE_CURRENCY', type_, val });
  }, []);

  const setActiveTab = useCallback((n) => {
    dispatch({ type: 'SET_ACTIVE_TAB', n });
  }, []);

  const saveAndOpenSheet = useCallback(() => {
    saveToLocalStorage(state.char, state);
    const raw = window.__gbRawStorage || localStorage;
    let id = raw.getItem('gb_active_char_id');
    if (!id) {
      id = generateCharId();
      raw.setItem('gb_active_char_id', id);
    }
    const qs = `?char=${encodeURIComponent(id)}`;
    const target = `/character-sheet${qs}`;
    const currentQs = window.location.search || '';
    if (target !== window.location.pathname + currentQs) {
      window.history.pushState(null, '', target);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      window.location.href = target;
    }
  }, [state.char, state]);

  const loadClassData = useCallback(() => {
    loadAllClassData(dispatch);
  }, []);

  const loadSpeciesData = useCallback(() => {
    fetchSpeciesData(dispatch);
  }, []);

  const loadBackgroundsData = useCallback(() => {
    fetchBackgroundsData(dispatch);
  }, []);

  const loadFeatsData = useCallback(() => {
    fetchFeatsData(dispatch);
  }, []);

  const loadSpellsData = useCallback(() => {
    fetchSpellsData(dispatch);
  }, []);

  const loadItemsData = useCallback(() => {
    fetchItemsData(dispatch);
  }, []);

  const actions = {
    setCharacterName, selectClass, selectLevel, selectSubclass,
    selectSpecies, selectBg, setBgAbility, setBgPatternIdx,
    setScoreMethod, setHpMode, setHpManualRoll,
    setPbScore, setArrAssign, setDicePool, setDiceAssign, setManualScore,
    toggleChoice, selectChoice, setChoices, setEquipChoices,
    toggleCantrip, toggleSpell,
    setWizardSpellbook, setWizardSpellMastery, setWizardSignatureSpells,
    setXp, addInventoryItem, removeInventoryItem, updateCurrency,
    saveAndOpenSheet, setActiveTab,
    loadClassData, loadSpeciesData, loadBackgroundsData,
    loadFeatsData, loadSpellsData, loadItemsData,
  };

  const contextValue = {
    state: { ...state.char, ...state },
    actions,
    ...state,
    ...state.char,
    ...actions,
  };

  return (
    <CharbuilderContext.Provider value={contextValue}>
      {children}
    </CharbuilderContext.Provider>
  );
}

export function useCharbuilderContext() {
  const ctx = useContext(CharbuilderContext);
  if (!ctx) {
    throw new Error('useCharbuilderContext must be used within a CharbuilderProvider');
  }
  return ctx;
}

export { CharbuilderContext };
