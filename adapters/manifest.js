/**
 * adapters/manifest.js
 * Lista ordinata di tutti i file adapter da caricare.
 * Aggiungi qui ogni nuovo file: verrà caricato automaticamente da loader.js.
 */

const ADAPTER_MANIFEST = [
  // ── Classi ──────────────────────────────────────────────
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
  'adapters/classes/wizard/transmuter.js',
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

  // Post-load defaults
  'adapters/classes/common-choice-meta.js',
];
