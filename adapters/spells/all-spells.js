import { registerGlobalSpellAdapter } from '../registry.js';

// Promote _adapterData fields to top-level so consumers can read
// spell.icon, spell.die, spell.toHit etc. without calling getCantripData().
registerGlobalSpellAdapter(function (spell) {
  var out = spell && typeof spell === "object" ? Object.assign({}, spell) : spell;
  if (!out || typeof out !== "object") return out;

  var d = out._adapterData;
  if (!d || typeof d !== "object") return out;

  if (d.icon        != null) out.icon        = d.icon;
  if (d.die         != null) out.die         = d.die;
  if (d.dmgType     != null) out.dmgType     = d.dmgType;
  if (d.toHit       != null) out.toHit       = d.toHit;
  if (d.hasSave     != null) out.hasSave     = d.hasSave;
  if (d.saveAbility != null) out.saveAbility = d.saveAbility;
  if (d.baseDie     != null) out.baseDie     = d.baseDie;
  if (d.upcastDie   != null) out.upcastDie   = d.upcastDie;
  if (d.heal        != null) out.heal        = d.heal;
  if (d.range       != null) out.rangeText   = d.range;
  if (d.aoe         != null) out.aoe         = d.aoe;
  if (d.notes       != null) out.notes       = d.notes;

  return out;
});
