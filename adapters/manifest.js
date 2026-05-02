/**
 * adapters/manifest.js
 * Lista ordinata di tutti i file adapter da caricare.
 * Aggiungi qui ogni nuovo file: verrà caricato automaticamente da loader.js.
 */

const ADAPTER_MANIFEST = [
  // ── Costanti condivise ───────────────────────────────────
  'adapters/spell-slots.js',
  'adapters/spellcasting-utils.js',

  // ── Classi ──────────────────────────────────────────────
  'adapters/classes/core.js',
  'adapters/classes/fighter/fighter.js',
  'adapters/classes/fighter/battle-master.js',
  'adapters/classes/fighter/banneret.js',
  'adapters/classes/fighter/champion.js',
  'adapters/classes/fighter/eldritch-knight.js',
  'adapters/classes/fighter/psi-warrior.js',

  'adapters/classes/cleric/cleric.js',
  'adapters/classes/cleric/knowledge.js',
  'adapters/classes/cleric/life.js',
  'adapters/classes/cleric/light.js',
  'adapters/classes/cleric/trickery.js',
  'adapters/classes/cleric/war.js',

  'adapters/classes/bard/bard.js',
  'adapters/classes/bard/lore.js',
  'adapters/classes/bard/swords.js',
    'adapters/classes/bard/dance.js',
  'adapters/classes/bard/glamour.js',
  'adapters/classes/bard/valor.js',
  'adapters/classes/bard/moon.js',

  'adapters/classes/wizard/wizard.js',
    'adapters/classes/wizard/abjurer.js',
  'adapters/classes/wizard/diviner.js',
  'adapters/classes/wizard/evoker.js',
  'adapters/classes/wizard/illusionist.js',
  'adapters/classes/wizard/bladesinger.js',

  'adapters/classes/artificer/artificer.js',
  'adapters/classes/artificer/alchemist.js',
  'adapters/classes/artificer/armorer.js',
  'adapters/classes/artificer/artillerist.js',
  'adapters/classes/artificer/battle-smith.js',
  'adapters/classes/artificer/cartographer.js',

  'adapters/classes/druid/druid.js',
  'adapters/classes/druid/land.js',
    'adapters/classes/druid/moon.js',
  'adapters/classes/druid/sea.js',
  'adapters/classes/druid/stars.js',

  'adapters/classes/monk/monk.js',
    'adapters/classes/monk/open-hand.js',
  'adapters/classes/monk/shadow.js',
  'adapters/classes/monk/elements.js',
  'adapters/classes/monk/mercy.js',

  'adapters/classes/paladin/paladin.js',
  'adapters/classes/paladin/noble-genies.js',
    'adapters/classes/paladin/devotion.js',
  'adapters/classes/paladin/ancients.js',
  'adapters/classes/paladin/glory.js',
  'adapters/classes/paladin/vengeance.js',

  'adapters/classes/ranger/ranger.js',
  'adapters/classes/ranger/hunter.js',
  'adapters/classes/ranger/beast-master.js',
    'adapters/classes/ranger/fey-wanderer.js',
  'adapters/classes/ranger/gloom-stalker.js',
  'adapters/classes/ranger/winter-walker.js',

  'adapters/classes/rogue/rogue.js',
    'adapters/classes/rogue/arcane-trickster.js',
  'adapters/classes/rogue/assassin.js',
  'adapters/classes/rogue/soulknife.js',
  'adapters/classes/rogue/thief.js',
  'adapters/classes/rogue/scion-of-the-three.js',

  'adapters/classes/sorcerer/sorcerer.js',
  'adapters/classes/sorcerer/draconic.js',
    'adapters/classes/sorcerer/wild-magic.js',
  'adapters/classes/sorcerer/clockwork-soul.js',
  'adapters/classes/sorcerer/clockwork.js',
  'adapters/classes/sorcerer/aberrant-mind.js',
  'adapters/classes/sorcerer/aberrant.js',
  'adapters/classes/sorcerer/spellfire.js',

  'adapters/classes/warlock/warlock.js',
    'adapters/classes/warlock/fiend.js',
  'adapters/classes/warlock/great-old-one.js',
  'adapters/classes/warlock/archfey.js',
  'adapters/classes/warlock/celestial.js',

  'adapters/classes/barbarian/barbarian.js',
  'adapters/classes/barbarian/wild-heart.js',
    'adapters/classes/barbarian/berserker.js',
  'adapters/classes/barbarian/world-tree.js',
  'adapters/classes/barbarian/zealot.js',

  // ── Specie ──────────────────────────────────────────────
  'adapters/species/core.js',
  'adapters/species/elf.js',
  'adapters/species/tiefling.js',
  'adapters/species/aasimar.js',
  'adapters/species/dragonborn.js',
  'adapters/species/gnome.js',
  'adapters/species/goliath.js',
  'adapters/species/human.js',
  'adapters/species/changeling.js',
  'adapters/species/dwarf.js',
  'adapters/species/halfling.js',
  'adapters/species/kalashtar.js',
  'adapters/species/khoravar.js',
  'adapters/species/orc.js',
  'adapters/species/shifter.js',
  'adapters/species/warforged.js',

  // ── Spell data ──────────────────────────────────────────
  'adapters/spells/core.js',
  'adapters/spells/all-spells.js',
  'adapters/spells/cantrips.js',
  'adapters/spells/spells.js',

  // ── Item data ───────────────────────────────────────────
  'adapters/items/core.js',

  // Feat adapter runtime
  'adapters/feats/core.js',
  'adapters/feats/all-feats.js',
  'adapters/feats/magic-initiate.js',
  'adapters/feats/ability-score-improvement.js',
  'adapters/feats/tough.js',
  'adapters/feats/fey-touched.js',
  'adapters/feats/shadow-touched.js',
  'adapters/feats/weapon-master.js',
  'adapters/feats/lucky.js',
  'adapters/feats/alert.js',
  'adapters/feats/artificer-initiate.js',
  'adapters/feats/ritual-caster.js',
  'adapters/feats/spell-sniper.js',
  'adapters/feats/telekinetic.js',
  'adapters/feats/telepathic.js',
  'adapters/feats/inspiring-leader.js',
  'adapters/feats/chef.js',
  'adapters/feats/healer.js',
  'adapters/feats/martial-weapon-training.js',
  'adapters/feats/charger.js',
  'adapters/feats/crossbow-expert.js',
  'adapters/feats/crusher.js',
  'adapters/feats/defensive-duelist.js',
  'adapters/feats/dual-wielder.js',
  'adapters/feats/grappler.js',
  'adapters/feats/great-weapon-master.js',
  'adapters/feats/mage-slayer.js',
  'adapters/feats/mounted-combatant.js',
  'adapters/feats/polearm-master.js',
  'adapters/feats/savage-attacker.js',
  'adapters/feats/sentinel.js',
  'adapters/feats/shield-master.js',
  'adapters/feats/sharpshooter.js',
  'adapters/feats/skulker.js',
  'adapters/feats/slasher.js',
  'adapters/feats/tavern-brawler.js',
  'adapters/feats/war-caster.js',
  'adapters/feats/resilient.js',
  'adapters/feats/elemental-adept.js',

  // Shared class/subclass/species runtime config
  'adapters/classes/runtime-config.js',

  // Post-load defaults
  'adapters/classes/common-choice-meta.js',
];
