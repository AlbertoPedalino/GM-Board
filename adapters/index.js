/**
 * adapters/index.js
 * Barrel — importa tutti gli adapter (attivando la registrazione)
 * e riesporta le funzioni più usate per comodità.
 */

// ── Foundation ──
import './registry.js';
export * from './registry.js';

// ── Spell slots ──
export * from './spell-slots.js';
export * from './spellcasting-utils.js';

// ── Pipeline cores ──
export {
  getGenericSpeciesChoiceSpecs,
  adaptSpeciesRecord,
  adaptSpeciesDataset,
} from './species/core.js';
export {
  adaptFeatRecord,
  adaptFeatsDataset,
  getFeatCategoryCodes,
  featHasCategory,
  getFeatMinLevel,
  formatFeatPrerequisite,
} from './feats/core.js';
export {
  adaptSpellRecord,
  adaptSpellsDataset,
  getReactionSpells,
} from './spells/core.js';
export {
  adaptItemRecord,
  adaptItemsDataset,
} from './items/core.js';
export {
  adaptClassRecord,
  adaptSubclassRecord,
  adaptClassesDataset,
  adaptSubclassesDataset,
} from './classes/core.js';
export {
  getGenericBackgroundOriginFeat,
  getGenericBackgroundChoiceSpecs,
  adaptBackgroundRecord,
  adaptBackgroundsDataset,
} from './backgrounds/core.js';

// ── Data adapters (import per side-effect — registrazione) ──
import './spell-slots.js';
import './spellcasting-utils.js';

// Species
import './species/core.js';
import './species/elf.js';
import './species/human.js';
import './species/dwarf.js';
import './species/dragonborn.js';
import './species/halfling.js';
import './species/gnome.js';
import './species/tiefling.js';
import './species/orc.js';
import './species/warforged.js';
import './species/goliath.js';
import './species/aasimar.js';
import './species/shifter.js';
import './species/kalashtar.js';
import './species/changeling.js';
import './species/khoravar.js';

// Feats
import './feats/all-feats.js';
import './feats/ability-score-improvement.js';
import './feats/alert.js';
import './feats/artificer-initiate.js';
import './feats/charger.js';
import './feats/chef.js';
import './feats/crossbow-expert.js';
import './feats/crusher.js';
import './feats/defensive-duelist.js';
import './feats/dual-wielder.js';
import './feats/elemental-adept.js';
import './feats/fey-touched.js';
import './feats/grappler.js';
import './feats/great-weapon-master.js';
import './feats/healer.js';
import './feats/inspiring-leader.js';
import './feats/lucky.js';
import './feats/mage-slayer.js';
import './feats/magic-initiate.js';
import './feats/martial-weapon-training.js';
import './feats/mounted-combatant.js';
import './feats/polearm-master.js';
import './feats/resilient.js';
import './feats/ritual-caster.js';
import './feats/savage-attacker.js';
import './feats/sentinel.js';
import './feats/shadow-touched.js';
import './feats/sharpshooter.js';
import './feats/shield-master.js';
import './feats/skulker.js';
import './feats/slasher.js';
import './feats/spell-sniper.js';
import './feats/tavern-brawler.js';
import './feats/telekinetic.js';
import './feats/telepathic.js';
import './feats/tough.js';
import './feats/war-caster.js';
import './feats/weapon-master.js';

// Spells
import './spells/all-spells.js';
import './spells/cantrips.js';
import './spells/spells.js';

// Items
import './items/core.js';

// Backgrounds
import './backgrounds/core.js';

// Classes
import './classes/core.js';
import './classes/fighter/fighter.js';
import './classes/fighter/battle-master.js';
import './classes/fighter/banneret.js';
import './classes/fighter/champion.js';
import './classes/fighter/eldritch-knight.js';
import './classes/fighter/psi-warrior.js';
import './classes/cleric/cleric.js';
import './classes/cleric/knowledge.js';
import './classes/cleric/life.js';
import './classes/cleric/light.js';
import './classes/cleric/trickery.js';
import './classes/cleric/war.js';
import './classes/bard/bard.js';
import './classes/bard/lore.js';
import './classes/bard/swords.js';
import './classes/bard/dance.js';
import './classes/bard/glamour.js';
import './classes/bard/valor.js';
import './classes/bard/moon.js';
import './classes/wizard/wizard.js';
import './classes/wizard/abjurer.js';
import './classes/wizard/diviner.js';
import './classes/wizard/evoker.js';
import './classes/wizard/illusionist.js';
import './classes/wizard/bladesinger.js';
import './classes/artificer/artificer.js';
import './classes/artificer/alchemist.js';
import './classes/artificer/armorer.js';
import './classes/artificer/artillerist.js';
import './classes/artificer/battle-smith.js';
import './classes/artificer/cartographer.js';
import './classes/druid/druid.js';
import './classes/druid/land.js';
import './classes/druid/moon.js';
import './classes/druid/sea.js';
import './classes/druid/stars.js';
import './classes/monk/monk.js';
import './classes/monk/open-hand.js';
import './classes/monk/shadow.js';
import './classes/monk/elements.js';
import './classes/monk/mercy.js';
import './classes/paladin/paladin.js';
import './classes/paladin/noble-genies.js';
import './classes/paladin/devotion.js';
import './classes/paladin/ancients.js';
import './classes/paladin/glory.js';
import './classes/paladin/vengeance.js';
import './classes/ranger/ranger.js';
import './classes/ranger/hunter.js';
import './classes/ranger/beast-master.js';
import './classes/ranger/fey-wanderer.js';
import './classes/ranger/gloom-stalker.js';
import './classes/ranger/winter-walker.js';
import './classes/rogue/rogue.js';
import './classes/rogue/arcane-trickster.js';
import './classes/rogue/assassin.js';
import './classes/rogue/soulknife.js';
import './classes/rogue/thief.js';
import './classes/rogue/scion-of-the-three.js';
import './classes/sorcerer/sorcerer.js';
import './classes/sorcerer/draconic.js';
import './classes/sorcerer/wild-magic.js';
import './classes/sorcerer/clockwork-soul.js';
import './classes/sorcerer/clockwork.js';
import './classes/sorcerer/aberrant-mind.js';
import './classes/sorcerer/aberrant.js';
import './classes/sorcerer/spellfire.js';
import './classes/warlock/warlock.js';
import './classes/warlock/fiend.js';
import './classes/warlock/great-old-one.js';
import './classes/warlock/archfey.js';
import './classes/warlock/celestial.js';
import './classes/barbarian/barbarian.js';
import './classes/barbarian/wild-heart.js';
import './classes/barbarian/berserker.js';
import './classes/barbarian/world-tree.js';
import './classes/barbarian/zealot.js';

// Config (post-load)
import './classes/runtime-config.js';
import './classes/common-choice-meta.js';

// Wizard-specific
import './classes/wizard/spellbook.js';
import './classes/wizard/ui-integration.js';
import './classes/wizard/debug.js';
