/**
 * adapters/spells/cantrips.js
 *
 * Dati strutturati per i cantrip. Nessun fallback su testo raw.
 * Ogni entry definisce esplicitamente:
 *   icon     — nome lucide icon
 *   die      — dado base danno (es. '1d8'). Scalato automaticamente x lv 5/11/17.
 *   dmgType  — tipo danno (stringa) o '' per utility
 *   range    — portata (stringa)
 *   toHit    — true = tiro per colpire (ATK); false = no
 *   hasSave  — true = tiro salvezza richiesto (SAV); false = no
 *   notes    — testo note extra (opzionale)
 */
import { registerCantripData } from '../registry.js';

/* ── Damaging — attack roll ── */
registerCantripData("Fire Bolt", {
  icon: "flame",
  die: "1d10", dmgType: "fire",
  range: "120 ft",
  toHit: true, hasSave: false,
  notes: ""
});
registerCantripData("Ray of Frost", {
  icon: "snowflake",
  die: "1d8", dmgType: "cold",
  range: "60 ft",
  toHit: true, hasSave: false,
  notes: "Speed −10 ft to target"
});
registerCantripData("Eldritch Blast", {
  icon: "zap",
  die: "1d10", dmgType: "force",
  range: "120 ft",
  toHit: true, hasSave: false,
  notes: ""
});
registerCantripData("Chill Touch", {
  icon: "bug",
  die: "1d10", dmgType: "necrotic",
  range: "Touch",
  toHit: true, hasSave: false,
  notes: "Prevents HP regeneration"
});
registerCantripData("Acid Splash", {
  icon: "flask",
  die: "1d6", dmgType: "acid",
  range: "60 ft",
  toHit: false, hasSave: true,
  notes: "DEX save. 2 targets"
});
/* ── Damaging — save ── */
registerCantripData("Poison Spray", {
  icon: "skull",
  die: "1d12", dmgType: "poison",
  range: "Touch",
  toHit: false, hasSave: true,
  notes: "CON save"
});
registerCantripData("Sacred Flame", {
  icon: "sun",
  die: "1d8", dmgType: "radiant",
  range: "60 ft",
  toHit: false, hasSave: true,
  notes: "DEX save, ignores cover"
});
registerCantripData("Toll the Dead", {
  icon: "bell",
  die: "1d8", dmgType: "necrotic",
  range: "60 ft",
  toHit: false, hasSave: true,
  notes: "WIS save. d12 if target missing HP"
});
registerCantripData("Vicious Mockery", {
  icon: "message-circle",
  die: "1d6", dmgType: "psychic",
  range: "60 ft",
  toHit: false, hasSave: true,
  notes: "WIS save. Target has disadvantage on next attack"
});
registerCantripData("Word of Radiance", {
  icon: "sunrise",
  die: "1d6", dmgType: "radiant",
  range: "Self",
  toHit: false, hasSave: true,
  notes: "CON save, each creature of your choice within 5 ft"
});
registerCantripData("Mind Sliver", {
  icon: "brain",
  die: "1d6", dmgType: "psychic",
  range: "60 ft",
  toHit: false, hasSave: true,
  notes: "INT save. Target −1d4 on next save"
});
registerCantripData("Create Bonfire", {
  icon: "flame",
  die: "1d8", dmgType: "fire",
  range: "60 ft",
  toHit: false, hasSave: true,
  notes: "DEX save (concentration). Ongoing dmg (action to re-hit)"
});
registerCantripData("Frostbite", {
  icon: "snowflake",
  die: "1d6", dmgType: "cold",
  range: "60 ft",
  toHit: false, hasSave: true,
  notes: "CON save. Target has disadvantage on next weapon attack"
});
registerCantripData("Thunderclap", {
  icon: "volume-2",
  die: "1d6", dmgType: "thunder",
  range: "Self",
  toHit: false, hasSave: true,
  notes: "CON save, 5-ft radius"
});
registerCantripData("Lightning Lure", {
  icon: "zap",
  die: "1d8", dmgType: "lightning",
  range: "Self",
  toHit: false, hasSave: true,
  notes: "STR save. Pull target up to 10 ft toward you"
});
registerCantripData("Sword Burst", {
  icon: "sword",
  die: "1d6", dmgType: "force",
  range: "Self",
  toHit: false, hasSave: true,
  notes: "DEX save, 5-ft radius"
});
registerCantripData("Primal Savagery", {
  icon: "claw",
  die: "1d10", dmgType: "acid",
  range: "Touch",
  toHit: true, hasSave: false,
  notes: ""
});
registerCantripData("Sorcerous Burst", {
  icon: "sparkles",
  die: "1d8", dmgType: "fire",
  range: "120 ft",
  toHit: true, hasSave: false,
  notes: "Exploding dice (Cha mod extra d8's)"
});
registerCantripData("Star Dust", {
  icon: "sparkle",
  die: "1d8", dmgType: "radiant",
  range: "60 ft",
  toHit: false, hasSave: true,
  notes: "CON save. Can Bestow minor light curse"
});
registerCantripData("Elemental Burst", {
  icon: "flame",
  die: "1d8", dmgType: "fire",
  range: "Self",
  toHit: false, hasSave: true,
  notes: "CON save, 10-ft radius. Type pick: fire/cold/lightning/thunder"
});
registerCantripData("Dancing Lights", {
  icon: "lightbulb",
  die: "", dmgType: "",
  range: "120 ft",
  toHit: false, hasSave: false,
  notes: "Create 4 lights. Concentration (C). 1-min duration."
});
registerCantripData("Druidcraft", {
  icon: "leaf",
  die: "", dmgType: "",
  range: "30 ft",
  toHit: false, hasSave: false,
  notes: "Weather prediction, bloom, sound/light effect."
});
registerCantripData("Friends", {
  icon: "smile",
  die: "", dmgType: "",
  range: "Self",
  toHit: false, hasSave: false,
  notes: "Advantage on Cha checks vs 1 target. After: hostile."
});
registerCantripData("Guidance", {
  icon: "compass",
  die: "", dmgType: "",
  range: "Touch",
  toHit: false, hasSave: false,
  notes: "+1d4 to one ability check (C, 1 min)."
});
registerCantripData("Light", {
  icon: "sun",
  die: "", dmgType: "",
  range: "Touch",
  toHit: false, hasSave: false,
  notes: "Object sheds bright light 20 ft, dim 40 ft. 1 hour."
});
registerCantripData("Mage Hand", {
  icon: "hand",
  die: "", dmgType: "",
  range: "30 ft",
  toHit: false, hasSave: false,
  notes: "Spectral hand, manipulate objects. 1 min."
});
registerCantripData("Mending", {
  icon: "hammer",
  die: "", dmgType: "",
  range: "Touch",
  toHit: false, hasSave: false,
  notes: "Repair a break or tear."
});
registerCantripData("Message", {
  icon: "message-circle",
  die: "", dmgType: "",
  range: "120 ft",
  toHit: false, hasSave: false,
  notes: "Whisper a message to 1 creature."
});
registerCantripData("Minor Illusion", {
  icon: "image",
  die: "", dmgType: "",
  range: "30 ft",
  toHit: false, hasSave: false,
  notes: "Create a sound or image. 1 min."
});
registerCantripData("Prestidigitation", {
  icon: "wand",
  die: "", dmgType: "",
  range: "10 ft",
  toHit: false, hasSave: false,
  notes: "Minor magical trick. 6 effects."
});
registerCantripData("Resistance", {
  icon: "shield",
  die: "", dmgType: "",
  range: "Touch",
  toHit: false, hasSave: false,
  notes: "+1d4 to one save (C, 1 min)."
});
registerCantripData("Shillelagh", {
  icon: "tree",
  die: "1d10", dmgType: "force",
  range: "Touch",
  toHit: true, hasSave: false,
  notes: "Club/quarterstaff becomes magical d10 force, uses spellcasting mod. 1 min."
});
registerCantripData("Spare the Dying", {
  icon: "heart",
  die: "", dmgType: "",
  range: "Touch",
  toHit: false, hasSave: false,
  notes: "Stabilize a creature at 0 HP."
});
registerCantripData("Thaumaturgy", {
  icon: "eye",
  die: "", dmgType: "",
  range: "30 ft",
  toHit: false, hasSave: false,
  notes: "Minor supernatural effect. 1 min."
});
registerCantripData("True Strike", {
  icon: "crosshair",
  die: "1d6", dmgType: "force",
  range: "Self",
  toHit: false, hasSave: false,
  notes: "Cantrip. On next turn: +1d6 force dmg to weapon attack (stacks with mod). Lv5+: 2d6. Lv11+: 3d6. Lv17+: 4d6."
});
registerCantripData("Shocking Grasp", {
  icon: "zap",
  die: "1d8", dmgType: "lightning",
  range: "Touch",
  toHit: true, hasSave: false,
  notes: "Target cannot take reactions. Advantage vs metal armor."
});
registerCantripData("Thorn Whip", {
  icon: "leaf",
  die: "1d6", dmgType: "piercing",
  range: "30 ft",
  toHit: true, hasSave: false,
  notes: "Pull target up to 10 ft toward you."
});
registerCantripData("Produce Flame", {
  icon: "flame",
  die: "1d8", dmgType: "fire",
  range: "30 ft",
  toHit: true, hasSave: false,
  notes: "Light + attack. 10-min duration."
});
registerCantripData("Magic Stone", {
  icon: "circle",
  die: "1d6", dmgType: "bludgeoning",
  range: "60 ft",
  toHit: true, hasSave: false,
  notes: "3 pebbles, +spellcasting mod dmg. 1 min."
});
registerCantripData("Infestation", {
  icon: "bug",
  die: "1d6", dmgType: "poison",
  range: "30 ft",
  toHit: false, hasSave: true,
  notes: "CON save. Target moves 5 ft random direction."
});
registerCantripData("Booming Blade", {
  icon: "sword",
  die: "1d8", dmgType: "thunder",
  range: "Self",
  toHit: false, hasSave: false,
  notes: "As part of attack, weapon deals extra 1d8 thunder. If target moves, 2d8 more."
});
registerCantripData("Green-Flame Blade", {
  icon: "flame",
  die: "1d8", dmgType: "fire",
  range: "Self",
  toHit: false, hasSave: false,
  notes: "As part of attack, 1d8 fire to target; 2nd creature within 5 ft takes mod dmg."
});
registerCantripData("Control Flames", {
  icon: "flame",
  die: "", dmgType: "",
  range: "60 ft",
  toHit: false, hasSave: false,
  notes: "Control nonmagical flame."
});
registerCantripData("Gust", {
  icon: "wind",
  die: "", dmgType: "",
  range: "30 ft",
  toHit: false, hasSave: false,
  notes: "Push object/creature. STR save."
});
registerCantripData("Mold Earth", {
  icon: "mountain",
  die: "", dmgType: "",
  range: "30 ft",
  toHit: false, hasSave: false,
  notes: "Move/dig loose earth."
});
registerCantripData("Shape Water", {
  icon: "droplet",
  die: "", dmgType: "",
  range: "30 ft",
  toHit: false, hasSave: false,
  notes: "Move/color/freeze water."
});
registerCantripData("Blade Ward", {
  icon: "shield",
  die: "", dmgType: "",
  range: "Self",
  toHit: false, hasSave: false,
  notes: "Resistance to bludgeoning/piercing/slashing dmg from weapon attacks. (C) 1 round."
});
registerCantripData("Decompose", {
  icon: "skull",
  die: "1d8", dmgType: "necrotic",
  range: "Touch",
  toHit: false, hasSave: true,
  notes: "CON save. Also advantage on Intimidation checks vs that creature for 1 min."
});
registerCantripData("Grave Touch", {
  icon: "hand",
  die: "1d8", dmgType: "necrotic",
  range: "Touch",
  toHit: true, hasSave: false,
  notes: "Also prevents target from healing until start of your next turn."
});
registerCantripData("Virtue", {
  icon: "heart",
  die: "", dmgType: "",
  range: "Touch",
  toHit: false, hasSave: false,
  notes: "Grant 1d4 temporary HP. (C) 1 min."
});
registerCantripData("Starry Wisp", {
  icon: "sparkle",
  die: "1d8", dmgType: "radiant",
  range: "60 ft",
  toHit: true, hasSave: false,
  notes: "Bright light till start of next turn; next ally attack roll vs target gains advantage if attacker can see."
});
