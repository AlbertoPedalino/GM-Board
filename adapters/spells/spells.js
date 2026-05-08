/**
 * adapters/spells/spells.js
 *
 * Dati strutturati per spell di livello 1–9.
 */
import { registerSpellData } from '../registry.js';

/* ════════════════════════════
   LIVELLO 1
════════════════════════════ */
registerSpellData("Magic Missile", {
  icon: "zap",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "force",
  baseDie: "3d4+3",
  upcastDie: "1d4+1",
  range: "120 ft", aoe: "",
  heal: false, concentration: false,
  notes: "3 dardi automatici (nessun tiro). +1 dardo per ogni slot superiore al 1°."
});
registerSpellData("Burning Hands", {
  icon: "flame",
  toHit: false, hasSave: true, saveAbility: "dex",
  dmgType: "fire",
  baseDie: "3d6", upcastDie: "1d6",
  range: "Self", aoe: "15-ft cone",
  heal: false, concentration: false,
  notes: "DEX save. Metà danno su successo."
});

registerSpellData("Cure Wounds", {
  icon: "heart-pulse",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "2d8+mod", upcastDie: "1d8",
  range: "Touch", aoe: "",
  heal: true, concentration: false,
  notes: "Cura 2d8 + mod. +1d8 per slot."
});
registerSpellData("Guiding Bolt", {
  icon: "sun",
  toHit: true, hasSave: false, saveAbility: null,
  dmgType: "radiant",
  baseDie: "4d6", upcastDie: "1d6",
  range: "120 ft", aoe: "",
  heal: false, concentration: false,
  notes: "Next attack vs target has advantage."
});
registerSpellData("Inflict Wounds", {
  icon: "hand",
  toHit: true, hasSave: false, saveAbility: null,
  dmgType: "necrotic",
  baseDie: "4d10", upcastDie: "1d10",
  range: "Touch", aoe: "",
  heal: false, concentration: false,
  notes: "Melee spell attack."
});
registerSpellData("Thunderwave", {
  icon: "volume-2",
  toHit: false, hasSave: true, saveAbility: "con",
  dmgType: "thunder",
  baseDie: "3d8", upcastDie: "1d8",
  range: "Self", aoe: "15-ft cube",
  heal: false, concentration: false,
  notes: "CON save. Push 10 ft."
});
registerSpellData("Bless", {
  icon: "star",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "30 ft", aoe: "",
  heal: false, concentration: true,
  notes: "+1d4 to attack and save for up to 3 creatures."
});
registerSpellData("Shield", {
  icon: "shield",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "Self", aoe: "",
  heal: false, concentration: false,
  notes: "Reaction: +5 AC until start of next turn."
});
registerSpellData("Healing Word", {
  icon: "message-circle",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "2d4+mod", upcastDie: "1d4",
  range: "60 ft", aoe: "",
  heal: true, concentration: false,
  notes: "Bonus Action: cura 2d4 + mod."
});
registerSpellData("Faerie Fire", {
  icon: "sparkle",
  toHit: false, hasSave: true, saveAbility: "dex",
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "60 ft", aoe: "20-ft cube",
  heal: false, concentration: true,
  notes: "DEX save. Attack advantage vs glowing creatures."
});
registerSpellData("Entangle", {
  icon: "leaf",
  toHit: false, hasSave: true, saveAbility: "str",
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "60 ft", aoe: "20-ft square",
  heal: false, concentration: true,
  notes: "STR save. Area difficult terrain; restrained on fail."
});
registerSpellData("Speak with Animals", {
  icon: "message-square",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "Self", aoe: "",
  heal: false, concentration: false,
  notes: "Comprehend/communicate with animals. 10 min."
});
registerSpellData("Tasha's Hideous Laughter", {
  icon: "smile",
  toHit: false, hasSave: true, saveAbility: "wis",
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "30 ft", aoe: "",
  heal: false, concentration: true,
  notes: "WIS save. Target falls prone, incapacitated (C)."
});
registerSpellData("Command", {
  icon: "message-square",
  toHit: false, hasSave: true, saveAbility: "wis",
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "60 ft", aoe: "",
  heal: false, concentration: false,
  notes: "WIS save. Target obeys 1-word command."
});
registerSpellData("Sleep", {
  icon: "moon",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "5d8", upcastDie: "2d8",
  range: "90 ft", aoe: "20-ft radius",
  heal: false, concentration: false,
  notes: "Puts creatures to sleep (lowest HP first)."
});

/* ════════════════════════════
   LIVELLO 2
════════════════════════════ */
registerSpellData("Spiritual Weapon", {
  icon: "sword",
  toHit: true, hasSave: false, saveAbility: null,
  dmgType: "force",
  baseDie: "1d8+mod", upcastDie: "1d8",
  range: "60 ft", aoe: "",
  heal: false, concentration: false,
  notes: "Bonus action. 1 min. +1d8 per 2 slot lv."
});
registerSpellData("Lesser Restoration", {
  icon: "heart",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "Touch", aoe: "",
  heal: false, concentration: false,
  notes: "Cure disease/poison/blind/deaf/paralyze."
});
registerSpellData("Darkvision", {
  icon: "eye",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "Touch", aoe: "",
  heal: false, concentration: false,
  notes: "Grant darkvision 60 ft for 8 hours."
});
registerSpellData("Invisibility", {
  icon: "eye-off",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "Touch", aoe: "",
  heal: false, concentration: true,
  notes: "Creature turns invisible (C). 1 hour."
});
registerSpellData("Hold Person", {
  icon: "hand",
  toHit: false, hasSave: true, saveAbility: "wis",
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "60 ft", aoe: "",
  heal: false, concentration: true,
  notes: "WIS save. Paralyzed (C). +1 target per slot."
});

/* ════════════════════════════
   LIVELLO 3
════════════════════════════ */
registerSpellData("Fireball", {
  icon: "flame",
  toHit: false, hasSave: true, saveAbility: "dex",
  dmgType: "fire",
  baseDie: "8d6", upcastDie: "1d6",
  range: "150 ft", aoe: "20-ft radius",
  heal: false, concentration: false,
  notes: "DEX save. Metà danno su successo."
});
registerSpellData("Lightning Bolt", {
  icon: "zap",
  toHit: false, hasSave: true, saveAbility: "dex",
  dmgType: "lightning",
  baseDie: "8d6", upcastDie: "1d6",
  range: "Self", aoe: "100-ft line",
  heal: false, concentration: false,
  notes: "DEX save. 100-ft line."
});
registerSpellData("Revivify", {
  icon: "heart",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "Touch", aoe: "",
  heal: true, concentration: false,
  notes: "Return to 1 HP (died last 1 min). 300 GP diamond."
});
registerSpellData("Counterspell", {
  icon: "x-circle",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "60 ft", aoe: "",
  heal: false, concentration: false,
  notes: "Reaction. Spell lv3 or lower: auto-success. Higher: DC 10 + spell lv check."
});
registerSpellData("Dispel Magic", {
  icon: "x-square",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "120 ft", aoe: "",
  heal: false, concentration: false,
  notes: "End spells on target. Lv3+: auto. Higher: check DC 10 + spell lv."
});
registerSpellData("Haste", {
  icon: "zap",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "30 ft", aoe: "",
  heal: false, concentration: true,
  notes: "+2 AC, double speed, extra action. (C) 1 min."
});
registerSpellData("Fly", {
  icon: "feather",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "Touch", aoe: "",
  heal: false, concentration: true,
  notes: "Fly 60 ft (C). 10 min."
});

/* ════════════════════════════
   LIVELLO 4
════════════════════════════ */
registerSpellData("Death Ward", {
  icon: "shield",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "Touch", aoe: "",
  heal: false, concentration: false,
  notes: "If target drops to 0 HP: 1 HP instead. 8 hours."
});
registerSpellData("Greater Invisibility", {
  icon: "eye-off",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "Touch", aoe: "",
  heal: false, concentration: true,
  notes: "Invisible (C). 1 min."
});

/* ════════════════════════════
   LIVELLO 5
════════════════════════════ */
registerSpellData("Mass Cure Wounds", {
  icon: "heart",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "5d8+mod", upcastDie: "1d8",
  range: "60 ft", aoe: "30-ft radius",
  heal: true, concentration: false,
  notes: "Cura 5d8 + mod for up to 6 creatures."
});
registerSpellData("Greater Restoration", {
  icon: "heart",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "Touch", aoe: "",
  heal: false, concentration: false,
  notes: "End charmed/frightened/curse/reduce exhaustion. 100 GP dust."
});
registerSpellData("Raise Dead", {
  icon: "heart",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "Touch", aoe: "",
  heal: true, concentration: false,
  notes: "Return to life (died last 10 days). 500 GP diamond."
});

/* ════════════════════════════
   LIVELLO 6
════════════════════════════ */
registerSpellData("Heal", {
  icon: "heart",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "70", upcastDie: "10",
  range: "60 ft", aoe: "",
  heal: true, concentration: false,
  notes: "Cura 70 HP + blind/deaf/disease removal."
});
registerSpellData("True Seeing", {
  icon: "eye",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "Touch", aoe: "",
  heal: false, concentration: false,
  notes: "True sight 120 ft. 1 hour."
});

/* ════════════════════════════
   LIVELLO 7+
════════════════════════════ */
registerSpellData("Resurrection", {
  icon: "heart",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "Touch", aoe: "",
  heal: true, concentration: false,
  notes: "Return to life (died last 100 years). 1,000 GP diamond."
});
registerSpellData("Power Word: Kill", {
  icon: "skull",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "60 ft", aoe: "",
  heal: false, concentration: false,
  notes: "Target (100 HP or fewer) dies."
});
registerSpellData("Holy Aura", {
  icon: "sun",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "Self", aoe: "30-ft radius",
  heal: false, concentration: true,
  notes: "Allies: advantage on saves. Foes: disadvantage on attacks. 1 min."
});

// Spells non-D&D 2024 but kept for legacy character compat
registerSpellData("Aid", {
  icon: "heart",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "5", upcastDie: "5",
  range: "30 ft", aoe: "",
  heal: false, concentration: false,
  notes: "+5 max HP & current HP for 3 targets. +5 per slot."
});
registerSpellData("Bless (Legacy)", {
  icon: "star",
  toHit: false, hasSave: false, saveAbility: null,
  dmgType: "",
  baseDie: "", upcastDie: "",
  range: "30 ft", aoe: "",
  heal: false, concentration: true,
  notes: "+1d4 to attack and save for up to 3 creatures (Legacy compat)."
});
