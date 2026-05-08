import { useState, useEffect, useCallback } from 'react';
import { Box, Stack, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import TopBar from './components/TopBar.jsx';
import AbilityScores from './components/AbilityScores.jsx';
import SavingThrows from './components/SavingThrows.jsx';
import Senses from './components/Senses.jsx';
import Proficiencies from './components/Proficiencies.jsx';
import HitDice from './components/HitDice.jsx';
import Skills from './components/Skills.jsx';
import RightTop from './components/RightTop.jsx';
import TabsPanel from './components/TabsPanel.jsx';
import DiceToast from './components/DiceToast.jsx';
import { loadCharacter, loadSheetState, saveHPState, saveDeathSaves, saveConditions, loadResources, saveResources } from './state.js';
import { calcMaxHP, getMod, getFinal, getPB, getSaveBonus } from './logic/calculations.js';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#12100e', paper: '#1a1713' },
    primary: { main: '#caa550', contrastText: '#17120d' },
    secondary: { main: '#70b7a6' },
    error: { main: '#de675f' },
    warning: { main: '#d69245' },
    success: { main: '#58b879' },
    text: { primary: '#efe6d4', secondary: '#c4b393' },
    divider: 'rgba(202, 165, 80, 0.22)',
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    h1: { fontSize: '1.5rem', fontWeight: 700 },
    h2: { fontSize: '1.15rem', fontWeight: 700 },
    button: { textTransform: 'none', letterSpacing: 0, fontWeight: 700 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCard: { styleOverrides: { root: { backgroundImage: 'none', border: '1px solid rgba(202, 165, 80, 0.18)' } } },
    MuiChip: { styleOverrides: { root: { maxWidth: '100%', minWidth: 0, flexShrink: 1 } } },
    MuiPaper: { styleOverrides: { root: { minWidth: 0 } } },
  },
});

export default function CharacterSheet() {
  const [C, setC] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [tab, setTab] = useState(0);
  const [diceToast, setDiceToast] = useState(null);
  const [resources, setResources] = useState({});

  useEffect(() => {
    const ch = loadCharacter();
    setC(ch);
    if (ch) {
      const s = loadSheetState(ch);
      setSheet(s);
      const res = loadResources(ch);
      setResources(res);
    }
  }, []);

  const syncSheet = useCallback((updates) => {
    setSheet(prev => ({ ...prev, ...updates }));
  }, []);

  const doRest = useCallback((type) => {
    const s = { ...sheet };
    if (type === 'long') {
      s.currentHP = s.maxHP;
      s.tempHP = 0;
      s.usedHD = 0;
      s.deathSaves = { success: 0, fail: 0 };
      s.spellSlotUsed = {};
      saveDeathSaves(s.deathSaves);
      localStorage.setItem('5e_slots_used', '{}');
    }
    s.usedHD = Math.min(s.usedHD || 0, type === 'short' ? s.usedHD : 0);
    saveHPState(s.currentHP, s.tempHP, s.maxHPBonus);
    localStorage.setItem('5e_hd_used', String(s.usedHD));
    setSheet(s);
  }, [sheet]);

  const adjustHP = useCallback((dir) => {
    if (!sheet) return;
    const s = { ...sheet };
    if (dir > 0) {
      s.currentHP = Math.min(s.maxHP, s.currentHP + 1);
    } else {
      let dmg = 1;
      if (s.tempHP > 0) {
        const absorbed = Math.min(s.tempHP, dmg);
        s.tempHP -= absorbed;
        dmg -= absorbed;
      }
      s.currentHP = Math.max(0, s.currentHP - dmg);
    }
    if (s.currentHP > 0) {
      s.deathSaves = { success: 0, fail: 0 };
      saveDeathSaves(s.deathSaves);
    }
    saveHPState(s.currentHP, s.tempHP, s.maxHPBonus);
    setSheet(s);
  }, [sheet]);

  const adjustTempHP = useCallback((dir) => {
    if (!sheet) return;
    const s = { ...sheet, tempHP: Math.max(0, sheet.tempHP + dir) };
    saveHPState(s.currentHP, s.tempHP, s.maxHPBonus);
    setSheet(s);
  }, [sheet]);

  const adjustMaxHpBonus = useCallback((dir) => {
    if (!sheet || !C) return;
    const s = { ...sheet, maxHPBonus: sheet.maxHPBonus + dir };
    const baseMax = Math.max(1, calcMaxHP(C));
    s.maxHP = Math.max(1, baseMax + s.maxHPBonus);
    if (s.currentHP > s.maxHP) s.currentHP = s.maxHP;
    saveHPState(s.currentHP, s.tempHP, s.maxHPBonus);
    setSheet(s);
  }, [sheet, C]);

  const setCurrentHP = useCallback((next) => {
    if (!sheet) return;
    const s = { ...sheet, currentHP: Math.max(0, Math.min(sheet.maxHP, parseInt(next) || 0)) };
    if (s.currentHP > 0) {
      s.deathSaves = { success: 0, fail: 0 };
      saveDeathSaves(s.deathSaves);
    }
    saveHPState(s.currentHP, s.tempHP, s.maxHPBonus);
    setSheet(s);
  }, [sheet]);

  const rollDeathSave = useCallback(() => {
    if (!sheet) return;
    if (sheet.currentHP > 0) {
      showDiceToast('Death Save', 'Available only at 0 HP', 0, []);
      return;
    }
    if (sheet.deathSaves.success >= 3 || sheet.deathSaves.fail >= 3) {
      showDiceToast('Death Save', sheet.deathSaves.success >= 3 ? 'Already stable' : 'Character is dead', 0, []);
      return;
    }
    const roll = Math.floor(Math.random() * 20) + 1;
    const ds = { ...sheet.deathSaves };
    let extra = '';
    if (roll === 1) { ds.fail = Math.min(3, ds.fail + 2); }
    else if (roll === 20) {
      ds.success = 0; ds.fail = 0;
      saveDeathSaves(ds);
      const s = { ...sheet, deathSaves: ds, currentHP: Math.min(sheet.maxHP, 1) };
      saveHPState(s.currentHP, s.tempHP, s.maxHPBonus);
      setSheet(s);
      showDiceToast('Death Save', 'Critical success: regain 1 HP', roll, [{ v: roll, faces: 20 }]);
      return;
    } else if (roll >= 10) { ds.success = Math.min(3, ds.success + 1); }
    else { ds.fail = Math.min(3, ds.fail + 1); }

    saveDeathSaves(ds);
    if (ds.success >= 3) extra = 'Stable (0 HP).';
    else if (ds.fail >= 3) extra = 'Dead.';
    else extra = `${ds.success} success / ${ds.fail} fail`;
    setSheet({ ...sheet, deathSaves: ds });
    showDiceToast('Death Save', extra, roll, [{ v: roll, faces: 20 }]);
  }, [sheet]);

  const toggleCondition = useCallback((key) => {
    if (!sheet) return;
    const idx = sheet.activeConditions.indexOf(key);
    const next = [...sheet.activeConditions];
    if (idx >= 0) next.splice(idx, 1);
    else next.push(key);
    saveConditions(next);
    setSheet({ ...sheet, activeConditions: next });
  }, [sheet]);

  const clearConditions = useCallback(() => {
    if (!sheet) return;
    saveConditions([]);
    setSheet({ ...sheet, activeConditions: [] });
  }, [sheet]);

  const showDiceToast = useCallback((label, detail, total, rolls) => {
    setDiceToast({ label, detail, total, rolls, timestamp: Date.now() });
  }, []);

  const rollD20 = useCallback((bonus, label, advantage) => {
    if (advantage === true) {
      const r1 = Math.floor(Math.random() * 20) + 1;
      const r2 = Math.floor(Math.random() * 20) + 1;
      const best = Math.max(r1, r2);
      showDiceToast(label, `Advantage: ${r1} / ${r2}`, best + bonus, [{ v: r1, faces: 20 }, { v: r2, faces: 20 }]);
    } else if (advantage === false) {
      const r1 = Math.floor(Math.random() * 20) + 1;
      const r2 = Math.floor(Math.random() * 20) + 1;
      const worst = Math.min(r1, r2);
      showDiceToast(label, `Disadvantage: ${r1} / ${r2}`, worst + bonus, [{ v: r1, faces: 20 }, { v: r2, faces: 20 }]);
    } else {
      const r = Math.floor(Math.random() * 20) + 1;
      showDiceToast(label, '', r + bonus, [{ v: r, faces: 20 }]);
    }
  }, [showDiceToast]);

  const rollSave = useCallback((stat) => {
    if (!C) return;
    const bonus = getSaveBonus(C, stat);
    const lbl = stat.charAt(0).toUpperCase() + stat.slice(1) + ' Save';
    rollD20(bonus, lbl);
  }, [C, rollD20]);

  const rollSkill = useCallback((skillName, bonus) => {
    rollD20(bonus, skillName + ' Check');
  }, [rollD20]);

  const updateXp = useCallback((val) => {
    const xp = parseInt(val) || 0;
    localStorage.setItem('5e_xp', String(xp));
    setSheet(prev => ({ ...prev, xpStored: xp }));
  }, []);

  const updateNotes = useCallback((val) => {
    localStorage.setItem('5e_notes', val);
    setSheet(prev => ({ ...prev, notes: val }));
  }, []);

  const downloadSheet = useCallback(() => {
    if (!C) return;
    const data = JSON.stringify({ type: 'gb-sheet-export', data: C, version: 1 }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${C.name || 'character'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [C]);

  if (!C || !sheet) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary', fontSize: '1.1rem' }}>
          No character found. Go back to the builder to create a character.
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
        <TopBar C={C} sheet={sheet} onRest={doRest} onDownload={downloadSheet} onUpdateXp={updateXp} />
        <AbilityScores C={C} sheet={sheet} onRoll={rollD20}
          onHeal={() => adjustHP(1)} onDamage={() => adjustHP(-1)}
          onTempHP={adjustTempHP} onMaxHPBonus={adjustMaxHpBonus} onSetHP={setCurrentHP} onDeathSave={rollDeathSave} />
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '200px 210px 1fr' },
          gap: '0.55rem',
          px: { xs: '0.6rem', md: '1.1rem' },
          pt: '0.55rem',
          alignItems: 'start',
        }}>
          <Box>
            <SavingThrows C={C} onRoll={rollSave} />
            <Senses C={C} />
            <Proficiencies C={C} />
            <HitDice C={C} sheet={sheet} />
          </Box>
          <Box>
            <Skills C={C} onRoll={rollSkill} />
          </Box>
          <Box>
            <RightTop C={C} sheet={sheet} onRoll={rollD20} resources={resources} setResources={setResources}
              onToggleCondition={toggleCondition} onClearConditions={clearConditions} />
            <TabsPanel C={C} sheet={sheet} tab={tab} setTab={setTab} onRoll={rollD20}
              resources={resources} setResources={setResources} />
          </Box>
        </Box>
      </Box>
      {diceToast && <DiceToast toast={diceToast} onClose={() => setDiceToast(null)} />}
    </ThemeProvider>
  );
}
