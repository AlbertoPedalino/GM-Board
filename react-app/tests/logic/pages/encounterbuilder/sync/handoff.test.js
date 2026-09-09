import test from 'node:test';
import assert from 'node:assert/strict';

class MemoryStorage {
  constructor() { this.store = new Map(); }

  getItem(key) { return this.store.has(key) ? this.store.get(key) : null; }

  setItem(key, value) { this.store.set(key, String(value)); }

  removeItem(key) { this.store.delete(key); }

  clear() { this.store.clear(); }

  key(index) { return Array.from(this.store.keys())[index] ?? null; }

  get length() { return this.store.size; }
}

if (!globalThis.localStorage) {
  Object.defineProperty(globalThis, 'localStorage', { value: new MemoryStorage(), configurable: true });
}
if (!globalThis.window) {
  Object.defineProperty(globalThis, 'window', {
    value: { dispatchEvent: () => true, CustomEvent: class {} },
    configurable: true,
  });
}
if (!globalThis.CustomEvent) {
  Object.defineProperty(globalThis, 'CustomEvent', { value: class {}, configurable: true });
}

const {
  sendEncounterToBuilder, encounterFromGroups, launchLibraryEncounter, withSheetIdentity,
} = await import('../../../../../src/pages/encounterbuilder/sync/handoff.js');
const {
  makeSavedEncounter, persistLibrary, persistParty, readPersistedInstance,
} = await import('../../../../../src/pages/encounterbuilder/state/storage.js');

const OGRE = { name: 'Ogre', source: 'MM', cr: '2', xp: 450, hp: { average: 59 } };
const GOBLIN = { name: 'Goblin', source: 'MM', cr: '1/4', xp: 50, hp: { average: 7 } };

test('a room becomes the two records the builder writes for a fight of its own', () => {
  localStorage.clear();
  const instanceId = 'enc-test-1';

  const link = sendEncounterToBuilder(instanceId, {
    name: 'Ebonscar — room 3',
    groups: [{ monster: OGRE, count: 2 }, { monster: GOBLIN, count: 4 }],
  });

  const persisted = readPersistedInstance(instanceId, [OGRE, GOBLIN]);
  // One saved encounter, one fight, and the fight points at the encounter.
  assert.equal(persisted.library.length, 1);
  assert.equal(persisted.library[0].name, 'Ebonscar — room 3');
  assert.equal(persisted.fightsData.items.length, 1);
  assert.equal(persisted.fightsData.items[0].encounterId, link.encounterId);
  assert.equal(persisted.fightsData.items[0].id, link.fightId);
  // Not made active: a GM sending twenty rooms in a row would have the
  // builder's current fight stolen twenty times.
  assert.equal(persisted.fightsData.activeFightId, null);
});

// The players have pieces on the map already. A second set of them, standing in
// the room they are about to walk into, is nobody's intention.
test('only the creatures are offered to the map, though the fight keeps the party', () => {
  localStorage.clear();
  const instanceId = 'enc-test-2';
  persistParty(instanceId, { count: 2, level: 3 }, [
    { name: 'Alba', hpMax: 24, initMod: 2 },
    { name: 'Bruno', hpMax: 31, initMod: 0 },
  ]);

  const link = sendEncounterToBuilder(instanceId, {
    name: 'Room 1',
    groups: [{ monster: OGRE, count: 1 }],
  });

  assert.deepEqual(link.combatants.map((combatant) => combatant.name), ['Ogre']);
  assert.ok(link.combatants.every((combatant) => combatant.type !== 'player'));

  // The saved fight is a combat, and initiative without the characters is not
  // one — so they are in the record even though they are not on the map.
  const persisted = readPersistedInstance(instanceId, [OGRE]);
  const names = persisted.fightsData.items[0].fight.combatants.map((item) => item.name);
  assert.deepEqual(names.sort(), ['Alba', 'Bruno', 'Ogre']);
});

// The reported symptom: a character with a blue icon and an uploaded portrait
// arrived in the fight as the first colour of the palette, with no face.
test('the party arrives wearing what its sheets say, not the palette', () => {
  localStorage.clear();
  const instanceId = 'enc-test-4';
  persistParty(instanceId, { count: 2, level: 3 }, [
    // Linked to a sheet, but holding the copy made the day it was imported.
    { name: 'Adhara', sourceId: 'char-adhara', hpMax: 24, initMod: 2, color: '#e05c5c' },
    // Typed in by hand: nothing to look up, and nothing to overwrite.
    { name: 'Bruno', hpMax: 31, initMod: 0, color: '#5ce07a' },
  ]);

  const link = sendEncounterToBuilder(instanceId, {
    name: 'Room 1',
    groups: [{ monster: OGRE, count: 1 }],
    roster: [{ characterId: 'char-adhara', color: '#5c8fe0', portraitPath: 'faces/adhara.png' }],
  });

  const persisted = readPersistedInstance(instanceId, [OGRE]);
  const stored = persisted.fightsData.items[0].fight.combatants;
  const adhara = stored.find((combatant) => combatant.name === 'Adhara');
  assert.equal(adhara.color, '#5c8fe0');
  // Stored, not merely built: the fight is kept as this snapshot and restored
  // from it, so a face that survives buildCombat and dies here is a face lost.
  assert.equal(adhara.portraitPath, 'faces/adhara.png');
  assert.equal(stored.find((combatant) => combatant.name === 'Bruno').color, '#5ce07a');
  // The party is in the fight; only the creatures go to the map.
  assert.deepEqual(link.combatants.map((combatant) => combatant.name), ['Ogre']);
});

test('a sheet that says nothing overwrites nothing', () => {
  const players = [
    { name: 'Adhara', sourceId: 'char-adhara', color: '#e05c5c', portraitPath: 'old.png' },
    { name: 'Bruno' },
  ];
  // No colour picked on the sheet and no portrait uploaded: the party keeps what
  // it has rather than being handed a pair of nulls.
  assert.deepEqual(
    withSheetIdentity(players, [{ characterId: 'char-adhara', color: null, portraitPath: null }]),
    players,
  );
  assert.equal(withSheetIdentity(players, []), players);
  assert.deepEqual(withSheetIdentity(null, [{ characterId: 'x', color: '#ffffff' }]), []);
});

test('a room with nothing in it is refused rather than written as an empty fight', () => {
  localStorage.clear();
  assert.deepEqual(encounterFromGroups([]), []);
  assert.deepEqual(encounterFromGroups([{ monster: null, count: 3 }]), []);
  assert.throws(() => sendEncounterToBuilder('enc-test-3', { groups: [] }), /no creatures/);
  assert.throws(() => sendEncounterToBuilder('', { groups: [{ monster: OGRE, count: 1 }] }), /no Encounter Builder/);
});

// The trip this saves: an encounter prepared in the builder but never launched
// had no fight, and a piece with no fight behind it is a picture — nothing is
// tracking its hit points. The GM found that out on the battle map, and had to
// go to the builder, launch it, and come back.
test('an encounter that was never launched is launched where it is asked for', () => {
  localStorage.clear();
  const instanceId = 'enc-test-launch';
  const card = makeSavedEncounter('Wolves', [
    { id: 'i1', name: 'Ogre', source: 'MM', cr: '2', xp: 450, qty: 2, monsterData: OGRE },
  ], { count: 4, level: 3 }, 'The Long Winter');
  persistLibrary(instanceId, [card]);

  const link = launchLibraryEncounter(instanceId, card.id, { monsters: [OGRE] });
  const persisted = readPersistedInstance(instanceId, [OGRE]);

  assert.equal(persisted.fightsData.items.length, 1);
  assert.equal(persisted.fightsData.items[0].id, link.fightId);
  assert.equal(persisted.fightsData.items[0].encounterId, card.id);
  // The card travels with the fight, so another device can open it.
  assert.equal(persisted.fightsData.items[0].encounter.id, card.id);
  // Not made active: the GM is placing pieces on a map, not opening a combat
  // view on some other screen.
  assert.equal(persisted.fightsData.activeFightId, null);
  assert.equal(link.combatants.length, 2);
  assert.ok(link.entry, 'a fight that was written is a row to write');
});

// A second fight for the same encounter would leave half the table tracking hit
// points the other half cannot see.
test('an encounter that already has a fight is handed that fight, not a new one', () => {
  localStorage.clear();
  const instanceId = 'enc-test-relaunch';
  const card = makeSavedEncounter('Wolves', [
    { id: 'i1', name: 'Goblin', source: 'MM', cr: '1/4', xp: 50, qty: 3, monsterData: GOBLIN },
  ], { count: 4, level: 1 });
  persistLibrary(instanceId, [card]);

  const first = launchLibraryEncounter(instanceId, card.id, { monsters: [GOBLIN] });
  const again = launchLibraryEncounter(instanceId, card.id, { monsters: [GOBLIN] });

  assert.equal(again.fightId, first.fightId);
  assert.equal(again.entry, null, 'nothing new to write online');
  assert.equal(again.combatants.length, 3);
  assert.equal(readPersistedInstance(instanceId, [GOBLIN]).fightsData.items.length, 1);
});

test('an encounter the builder no longer has is said out loud rather than placed', () => {
  localStorage.clear();
  assert.throws(() => launchLibraryEncounter('enc-test-missing', 'gone'), /no longer in the Encounter Builder/);
  assert.throws(() => launchLibraryEncounter('', 'gone'), /no Encounter Builder/);
});
