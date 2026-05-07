# Wizard Spellbook System

## Overview

Il sistema completo per gestire lo Spellbook del Wizard secondo le regole D&D 5e:

- **Spellbook**: lista completa di incantesimi imparati (6 iniziali + 2/livello)
- **Prepared Spells**: sottoinsieme selezionabile (max: Livello + INT modifier)
- **Spell Mastery** (L18): 1 L1 + 1 L2 sempre lanciabili
- **Signature Spells** (L20): 2 L3 sempre preparate, 1×/SR each

---

## API Reference

### WizardSpellbookAPI (spellbook.js)

#### `initWizardSpellbook(character, level)`
Inizializza la struttura dello spellbook se non esiste.
```javascript
WizardSpellbookAPI.initWizardSpellbook(character, 1);
```

#### `calcMaxPreparedSpells(level, intModifier) → number`
Calcola il numero massimo di incantesimi preparabili.
```javascript
const max = WizardSpellbookAPI.calcMaxPreparedSpells(5, 2); // 7
```

#### `getAvailableWizardSpells(character, level, intMod) → object`
Ritorna gli incantesimi che il wizard può lanciare.
```javascript
const spells = WizardSpellbookAPI.getAvailableWizardSpells(char, 5, 2);
// { prepared: [...], mastery: [...], signature: [...], all: [...] }
```

#### `isInSpellbook(character, spellName, spellLevel) → boolean`
Controlla se un incantesimo è nel spellbook.
```javascript
if (WizardSpellbookAPI.isInSpellbook(char, 'Magic Missile', 1)) {
  // L'incantesimo è conosciuto
}
```

#### `addToSpellbook(character, spellName, spellLevel) → boolean`
Aggiunge un incantesimo al spellbook (es. trovato durante l'avventura).
```javascript
WizardSpellbookAPI.addToSpellbook(char, 'Fireball', 3);
```

#### `togglePreparedSpell(character, spellName, spellLevel, level, intMod) → boolean`
Aggiunge o rimuove un incantesimo dai prepared, con validazione automatica del limite.
```javascript
const success = WizardSpellbookAPI.togglePreparedSpell(char, 'Magic Missile', 1, 5, 2);
if (!success) console.log("Raggiunto il limite di incantesimi preparati!");
```

#### `setSpellMastery(character, spell1Name, spell2Name) → boolean`
Imposta gli incantesimi di Spell Mastery (L18).
```javascript
WizardSpellbookAPI.setSpellMastery(char, 'Magic Missile', 'Scorching Ray');
```

#### `setSignatureSpells(character, spell1Name, spell2Name) → boolean`
Imposta gli incantesimi di Signature Spells (L20).
```javascript
WizardSpellbookAPI.setSignatureSpells(char, 'Lightning Bolt', 'Counterspell');
```

---

### WizardSheetIntegration (sheet-integration.js)

Wrappers di integrazione per il character-sheet.html:

#### `wizardSpellLimit(cls, character, isCantrip) → object|null`
Calcola il limite di incantesimi preparati per il wizard nel picker.
```javascript
const limit = WizardSheetIntegration.wizardSpellLimit(cls, character, false);
// { max: 7, current: 5 }
```

#### `validateWizardSpellToggle(character, spellName, spellLevel, wizardLevel, intMod) → boolean`
Valida se è possibile aggiungere/rimuovere un incantesimo.
```javascript
if (WizardSheetIntegration.validateWizardSpellToggle(char, 'Fireball', 3, 5, 2)) {
  // OK aggiungere
}
```

#### `isWizardSpellLearned(character, spellName, spellLevel) → boolean`
Controlla se il wizard conosce l'incantesimo (nel spellbook).
```javascript
if (WizardSheetIntegration.isWizardSpellLearned(char, 'Magic Missile', 1)) {
  // Badge: "nel spellbook"
}
```

#### `learnWizardSpell(character, spellName, spellLevel) → boolean`
Aggiunge un incantesimo al spellbook (es. trovato su scroll).
```javascript
WizardSheetIntegration.learnWizardSpell(char, 'Wish', 9);
```

#### `syncWizardPreparedSpells(character, wizardLevel, intModifier)`
Sincronizza i prepared spells con il limite (rimuove i sottoselezioni se necessario).
```javascript
WizardSheetIntegration.syncWizardPreparedSpells(char, 5, 2);
```

#### `getWizardBonusSpells(character) → object`
Ritorna Spell Mastery e Signature Spells.
```javascript
const bonus = WizardSheetIntegration.getWizardBonusSpells(char);
// { mastery: [...], signature: [...] }
```

---

## Data Structure

Nel character object:

```javascript
// SPELLBOOK: tutti gli incantesimi imparati
character.wizardSpellbook = {
  1: ['Magic Missile', 'Burning Hands', 'Sleep', ...],
  2: ['Scorching Ray', 'Fireball', ...],
  3: [],
  ...9: []
}

// PREPARED: sottoinsieme selezionato (max: Level + INT mod)
character.selectedSpells = {
  1: ['Magic Missile', 'Sleep'],          // 2/7 prepared
  2: ['Scorching Ray'],                    // 1/7 prepared
  3: [],
  ...
}

// SPELL MASTERY (L18): sempre disponibili, non contano nel limite
character.wizardSpellMastery = {
  1: ['Magic Missile'],                    // lanciabile at will
  2: ['Fireball']                          // lanciabile at will
}

// SIGNATURE SPELLS (L20): sempre preparate, 1×/SR each
character.wizardSignatureSpells = {
  3: ['Lightning Bolt', 'Counterspell']    // sempre prepared, 1×/SR
}
```

---

## Integration Steps

### 1. Nel HTML (character-sheet.html)

Aggiungere gli script nella `<head>` **prima** di character-sheet.html:
```html
<script src="adapters/classes/wizard/spellbook.js"></script>
<script src="adapters/classes/wizard/sheet-integration.js"></script>
```

### 2. Nel Spell Picker

Modificare `_buildPickerSpellList()` per i wizard:

```javascript
function _buildPickerSpellList(){ 
  // ... existing code ...
  
  // Per Wizard: usare il limite di prepared spells
  const lim = cls?.clsName.toLowerCase() === 'wizard'
    ? WizardSheetIntegration.wizardSpellLimit(cls, bucket, lv === 0)
    : _clsSpellLimit(cls, lv === 0);
  
  // ... rest of code ...
}
```

### 3. Nel Toggle Spell

Modificare `toggleSheetSpell()`:

```javascript
function toggleSheetSpell(name, level){
  // ... existing code ...
  
  const cls = /* get wizard class */;
  if (cls.clsName.toLowerCase() === 'wizard') {
    const intMod = getMod(getFinal('int'));
    const ok = WizardSheetIntegration.validateWizardSpellToggle(
      bucket, name, level, cls.lv, intMod
    );
    if (!ok) {
      alert("Hai già preparato il massimo di incantesimi per questo livello!");
      return;
    }
  }
  
  // ... toggle logic ...
}
```

### 4. Aggiungere UI per:

- **Spellbook Discovery**: Button "Learn Spell" per aggiungere incantesimi trovati
- **Prepare/Unprepare**: Tab separato per gestire quali incantesimi preparare
- **Spell Mastery**: Input per selezionare L1 + L2 spell (L18)
- **Signature Spells**: Input per selezionare 2 L3 spells (L20)

---

## Example: Full Character Setup

```javascript
// Nuovo wizard L5 con INT 16 (+3)
const wizard = {
  name: 'Gandalf',
  clsName: 'Wizard',
  lv: 5,
  str: 8, dex: 10, con: 12, int: 16, wis: 14, cha: 13
};

// Inizializza
WizardSpellbookAPI.initWizardSpellbook(wizard, 1);

// Aggiungi 6 incantesimi iniziali al spellbook
['Magic Missile', 'Burning Hands', 'Sleep', 'Detect Magic', 'Mage Armor', 'Identify'].forEach(s => 
  WizardSpellbookAPI.addToSpellbook(wizard, s, 1)
);
['Scorching Ray', 'Fireball'].forEach(s => 
  WizardSpellbookAPI.addToSpellbook(wizard, s, 2)
);

// Preparati a L5 con INT +3: max 5+3 = 8
const maxPrepared = WizardSpellbookAPI.calcMaxPreparedSpells(5, 3); // 8

// Preparare alcuni incantesimi
WizardSpellbookAPI.togglePreparedSpell(wizard, 'Magic Missile', 1, 5, 3);   // ✓ 1/8
WizardSpellbookAPI.togglePreparedSpell(wizard, 'Burning Hands', 1, 5, 3);   // ✓ 2/8
WizardSpellbookAPI.togglePreparedSpell(wizard, 'Sleep', 1, 5, 3);           // ✓ 3/8
WizardSpellbookAPI.togglePreparedSpell(wizard, 'Scorching Ray', 2, 5, 3);   // ✓ 4/8
WizardSpellbookAPI.togglePreparedSpell(wizard, 'Fireball', 2, 5, 3);        // ✓ 5/8

// Risultato
console.log(wizard.selectedSpells);
// { 1: ['Magic Missile', 'Burning Hands', 'Sleep'], 2: ['Scorching Ray', 'Fireball'] }

console.log(WizardSpellbookAPI.getAvailableWizardSpells(wizard, 5, 3));
// { prepared: [...5 spells], mastery: [], signature: [], all: [...5 spells] }
```

---

## Notes

- **Spell Mastery** non conta nei prepared spells
- **Signature Spells** non conta nei prepared spells (ma sono sempre prepared)
- **Rituals**: Il wizard può castare qualsiasi rituale dal suo spellbook senza prepararli
- **Levellare**: Ogni livello +1, aggiungi +2 incantesimi al spellbook (scelti dal player)
- **Copying Spells**: Permetti di aggiungere incantesimi trovati con `learnWizardSpell()`
