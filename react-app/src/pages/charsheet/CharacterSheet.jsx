import { useState, useEffect, useCallback } from 'react';
import { Box, Stack, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slider, Typography } from '@mui/material';
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
import { loadCharacter, loadSheetState, saveHPState, saveDeathSaves, saveInspiration, saveConditions, saveInventory, saveCurrency, saveCurrentCharacter, loadResources, saveResources } from './state.js';
import { calcMaxHP, getMod, getFinal, getPB, getSaveBonus } from './logic/calculations.js';
import { applyResourceRest, getAllResourceDefs, getTotalHitDice, normalizeResourceMax } from './logic/restResources.js';
import { setStorageItem, setStorageJson } from '../../shared/storage.js';

export default function CharacterSheet() {
  const [C, setC] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [tab, setTab] = useState(0);
  const [diceToast, setDiceToast] = useState(null);
  const [resources, setResources] = useState({});
  const [shortRestOpen, setShortRestOpen] = useState(false);
  const [longRestOpen, setLongRestOpen] = useState(false);
  const [hdToSpend, setHdToSpend] = useState(0);

  useEffect(() => {
    const ch = loadCharacter();
    setC(ch);
    if (ch) {
      const s = loadSheetState(ch);
      setSheet(s);
      const stored = loadResources(ch);
      const allResDefs = getAllResourceDefs(ch);
      const merged = { ...stored };
      allResDefs.forEach(def => {
        if (def.key && merged[def.key] == null) {
          merged[def.key] = normalizeResourceMax(def);
        }
      });
      setResources(merged);
      saveResources(merged);
    }
  }, []);

  const syncSheet = useCallback((updates) => {
    setSheet(prev => ({ ...prev, ...updates }));
  }, []);

  const updateCurrentCharacter = useCallback((updater) => {
    setC(prev => {
      if (!prev) return prev;
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveCurrentCharacter(next);
      return next;
    });
  }, []);

  const updateInventory = useCallback((inventory) => {
    saveInventory(inventory);
    setSheet(prev => ({ ...prev, sheetInventory: inventory }));
    updateCurrentCharacter(prev => ({ ...prev, inventory }));
  }, [updateCurrentCharacter]);

  const updateCurrency = useCallback((currency) => {
    saveCurrency(currency);
    setSheet(prev => ({ ...prev, sheetCurrency: currency }));
    updateCurrentCharacter(prev => ({ ...prev, currency }));
  }, [updateCurrentCharacter]);

  const updateSpells = useCallback((nextSpellData) => {
    updateCurrentCharacter(prev => ({ ...prev, ...nextSpellData }));
  }, [updateCurrentCharacter]);

  const openShortRest = useCallback(() => {
    const totalHD = getTotalHitDice(C);
    const remaining = Math.max(0, totalHD - (sheet.usedHD || 0));
    setHdToSpend(Math.min(1, remaining));
    setShortRestOpen(true);
  }, [C, sheet]);

  const confirmShortRest = useCallback(() => {
    const s = { ...sheet };
    let res = { ...resources };
    const conMod = getMod(getFinal(C, 'con'));
    const faces = C.clsSnapshot?.hd?.faces || 8;
    const n = Math.max(0, Math.min(hdToSpend, Math.max(0, getTotalHitDice(C) - (s.usedHD || 0))));

    let totalHeal = 0;
    const rolls = [];
    for (let i = 0; i < n; i++) {
      const v = Math.floor(Math.random() * faces) + 1;
      rolls.push({ v, faces });
      totalHeal += v + conMod;
    }

    s.currentHP = Math.min(s.maxHP, s.currentHP + totalHeal);
    s.usedHD = (s.usedHD || 0) + n;
    saveHPState(s.currentHP, s.tempHP, s.maxHPBonus);
    setStorageItem('5e_hd_used', s.usedHD);

    if (C) {
      res = applyResourceRest(res, getAllResourceDefs(C), C, 'short');
      setResources(res);
      saveResources(res);
    }

    setSheet(s);
    setShortRestOpen(false);
    showDiceToast('Short Rest', `Healed ${totalHeal} HP (${n} HD spent)`, totalHeal, rolls);
  }, [sheet, resources, C, hdToSpend]);

  const openLongRest = useCallback(() => {
    setLongRestOpen(true);
  }, []);

  const confirmLongRest = useCallback(() => {
    const s = { ...sheet };
    let res = { ...resources };
    s.currentHP = s.maxHP;
    s.tempHP = 0;
    s.usedHD = 0;
    s.deathSaves = { success: 0, fail: 0 };
    s.spellSlotUsed = {};
    saveDeathSaves(s.deathSaves);
    setStorageJson('5e_slots_used', {});
    saveHPState(s.currentHP, s.tempHP, s.maxHPBonus);
    setStorageItem('5e_hd_used', 0);

    if (C) {
      res = applyResourceRest(res, getAllResourceDefs(C), C, 'long');
      setResources(res);
      saveResources(res);
    }

    setSheet(s);
    setLongRestOpen(false);
    showDiceToast('Long Rest', 'Fully restored!', 0, []);
  }, [sheet, resources, C]);

  const doRest = useCallback((type) => {
    const s = { ...sheet };
    let res = { ...resources };
    if (type === 'long') {
      s.currentHP = s.maxHP;
      s.tempHP = 0;
      s.usedHD = 0;
      s.deathSaves = { success: 0, fail: 0 };
      s.spellSlotUsed = {};
      saveDeathSaves(s.deathSaves);
      setStorageJson('5e_slots_used', {});
    }
    s.usedHD = Math.min(s.usedHD || 0, type === 'short' ? s.usedHD : 0);
    saveHPState(s.currentHP, s.tempHP, s.maxHPBonus);
    setStorageItem('5e_hd_used', s.usedHD);
    if (C) {
      res = applyResourceRest(res, getAllResourceDefs(C), C, type);
      setResources(res);
      saveResources(res);
    }
    setSheet(s);
  }, [sheet, resources, C]);

  const adjustHP = useCallback((dir, amount = 1) => {
    if (!sheet) return;
    const s = { ...sheet };
    const dmg = Math.max(1, Math.floor(amount || 1));
    if (dir > 0) {
      s.currentHP = Math.min(s.maxHP, s.currentHP + dmg);
    } else {
      let remaining = dmg;
      if (s.tempHP > 0) {
        const absorbed = Math.min(s.tempHP, remaining);
        s.tempHP -= absorbed;
        remaining -= absorbed;
      }
      s.currentHP = Math.max(0, s.currentHP - remaining);
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

  const toggleInspiration = useCallback(() => {
    if (!sheet) return;
    const next = !sheet.sheetInspiration;
    saveInspiration(next);
    setSheet({ ...sheet, sheetInspiration: next });
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
    setStorageItem('5e_xp', xp);
    setSheet(prev => ({ ...prev, xpStored: xp }));
  }, []);

  const updateNotes = useCallback((val) => {
    setStorageItem('5e_notes', val);
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
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary', fontSize: '1.1rem' }}>
        No character found. Go back to the builder to create a character.
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
        <TopBar C={C} sheet={sheet} onShortRest={openShortRest} onLongRest={openLongRest} onDownload={downloadSheet} onUpdateXp={updateXp} />
        <AbilityScores C={C} sheet={sheet} onRoll={rollD20}
          onHeal={(amt) => adjustHP(1, amt)} onDamage={(amt) => adjustHP(-1, amt)}
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
            <RightTop C={C} sheet={sheet} onRoll={rollD20}
              onToggleCondition={toggleCondition} onClearConditions={clearConditions}
              onToggleInspiration={toggleInspiration} />
            <TabsPanel C={C} sheet={sheet} tab={tab} setTab={setTab} onRoll={rollD20}
              resources={resources} setResources={setResources} onRest={doRest} onShowToast={showDiceToast}
              onUpdateInventory={updateInventory} onUpdateCurrency={updateCurrency} onUpdateSpells={updateSpells} />
          </Box>
        </Box>
      {diceToast && <DiceToast toast={diceToast} onClose={() => setDiceToast(null)} />}

      <Dialog open={shortRestOpen} onClose={() => setShortRestOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Cinzel", Georgia, serif', color: '#edd48a' }}>Short Rest</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mb: 2 }}>
            Spend Hit Dice (d{C.clsSnapshot?.hd?.faces || 8}) to recover HP. You recover CON mod ({getMod(getFinal(C, 'con'))}) per HD spent.
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mb: 1 }}>
            Available: {Math.max(0, getTotalHitDice(C) - (sheet.usedHD || 0))} HD
          </Typography>
          <Slider
            value={hdToSpend}
            onChange={(_, v) => setHdToSpend(v)}
            min={0}
            max={Math.max(0, getTotalHitDice(C) - (sheet.usedHD || 0))}
            step={1}
            marks
            valueLabelDisplay="auto"
            sx={{ color: '#caa550' }}
          />
          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', textAlign: 'center' }}>
            Healing: {hdToSpend}d{C.clsSnapshot?.hd?.faces || 8}{getMod(getFinal(C, 'con')) >= 0 ? '+' : ''}{getMod(getFinal(C, 'con'))} × {hdToSpend} HD
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShortRestOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={confirmShortRest} disabled={hdToSpend === 0}>
            Take Short Rest
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={longRestOpen} onClose={() => setLongRestOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Cinzel", Georgia, serif', color: '#edd48a' }}>Take a Long Rest?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
            This will restore all HP, Hit Dice, spell slots, and class resources.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLongRestOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={confirmLongRest}>Confirm Long Rest</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
