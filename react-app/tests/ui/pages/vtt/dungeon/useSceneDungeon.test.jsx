import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';
import { useSceneDungeon } from '../../../../../src/pages/vtt/dungeon/useSceneDungeon.js';
import { combatantToToken } from '../../../../../src/shared/vtt/tokens/encounterImport.js';
import { fightWithTokenVitals } from '../../../../../src/shared/vtt/tokens/encounterSync.js';

const mocks = vi.hoisted(() => ({
  listInstanceFights: vi.fn(), saveInstanceFight: vi.fn(),
  readSceneDungeon: vi.fn(), saveSceneDungeon: vi.fn(),
  localFightPresence: vi.fn(), sendEncounterToBuilder: vi.fn(),
  readPersistedInstance: vi.fn(),
  auth: { cloudEnabled: true, status: 'authed' },
}));
vi.mock('../../../../../src/shared/cloud/api/encounterFights.js', () => ({
  listInstanceFights: mocks.listInstanceFights, saveInstanceFight: mocks.saveInstanceFight,
}));
vi.mock('../../../../../src/shared/cloud/api/dungeon.js', () => ({
  readSceneDungeon: mocks.readSceneDungeon, saveSceneDungeon: mocks.saveSceneDungeon,
}));
vi.mock('../../../../../src/pages/encounterbuilder/sync/handoff.js', () => ({
  localFightPresence: mocks.localFightPresence, sendEncounterToBuilder: mocks.sendEncounterToBuilder,
}));
vi.mock('../../../../../src/pages/encounterbuilder/state/storage.js', () => ({
  readPersistedInstance: mocks.readPersistedInstance,
}));
vi.mock('../../../../../src/shared/cloud/auth/AuthProvider.jsx', () => ({
  useAuth: () => mocks.auth,
}));
vi.mock('../../../../../src/shared/cloud/api/hexcrawl.js', () => ({
  readCampaignHexcrawlBoard: async () => 'board_1', readHexcrawlBoard: vi.fn(),
}));
vi.mock('../../../../../src/shared/dungeon/linkedEncounters.js', () => ({
  encounterInstanceForBoard: () => null,
  pickEncounterInstance: (_boards, encounters) => encounters[0],
  missingLinkReason: () => 'No linked builder',
}));
vi.mock('../../../../../src/shared/cloud/sections/cloudSections.js', () => ({
  getCloudSection: () => ({ listInstances: async () => [{ id: 'enc_a' }] }),
}));

const OGRE = { name: 'Ogre', source: 'MM', cr: '2', hp: { average: 59 } };
const EXISTING = { instanceId: 'enc_a', fightId: 900, encounterId: 500, combatants: [] };
const CREATED = { instanceId: 'enc_a', fightId: 901, encounterId: 501, combatants: [], entry: { id: 901 } };
const KEY = { id: 'dungeon_1', rooms: [{
  id: 'room_1', slots: [{ extra: { kind: 'enc', data: { xp: 450 } } }],
}] };

beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth = { cloudEnabled: true, status: 'authed' };
  mocks.localFightPresence.mockReturnValue('unknown');
  mocks.readPersistedInstance.mockReturnValue({ fightsData: { items: [] } });
  mocks.listInstanceFights.mockResolvedValue([]);
  mocks.readSceneDungeon.mockResolvedValue({ key: KEY, fights: { room_1: EXISTING } });
  mocks.saveSceneDungeon.mockResolvedValue({});
  mocks.saveInstanceFight.mockResolvedValue(null);
  mocks.sendEncounterToBuilder.mockReturnValue(CREATED);
});

async function openDungeon() {
  const hook = renderHook(() => useSceneDungeon({
    scene: { id: 'scene_1', campaignId: 'campaign_1' },
    isGm: true, monsters: [OGRE], partySize: 1, roster: [],
  }));
  await waitFor(() => {
    expect(hook.result.current.key).toEqual(KEY);
    expect(hook.result.current.encounterInstance?.id).toBe('enc_a');
  });
  return hook;
}

test.each(['unknown', 'missing'])('a deleted room fight is recreated when local presence is %s', async (presence) => {
  mocks.localFightPresence.mockReturnValue(presence);
  const { result } = await openDungeon();
  let link;
  await act(async () => { link = await result.current.sendRoomToBuilder(1); });
  expect(mocks.listInstanceFights).toHaveBeenCalledWith('enc_a');
  expect(link.fightId).toBe(901);
  expect(mocks.sendEncounterToBuilder).toHaveBeenCalledTimes(1);
  expect(mocks.saveInstanceFight).toHaveBeenCalledWith('enc_a', CREATED.entry);
  expect(result.current.fights.room_1.fightId).toBe(901);
  expect(mocks.saveSceneDungeon).toHaveBeenCalledWith('scene_1', { fights: { room_1: link } });
  mocks.localFightPresence.mockReturnValue('present');
  await act(async () => { expect(await result.current.sendRoomToBuilder(1)).toEqual(link); });
  expect(mocks.sendEncounterToBuilder).toHaveBeenCalledTimes(1);
});

test('an unknown local fight still present online is reused', async () => {
  mocks.listInstanceFights.mockResolvedValue([{ id: '900' }]);
  const { result } = await openDungeon();
  await act(async () => { expect(await result.current.sendRoomToBuilder(1)).toEqual(EXISTING); });
  expect(mocks.listInstanceFights).toHaveBeenCalledWith('enc_a');
  expect(mocks.sendEncounterToBuilder).not.toHaveBeenCalled();
  expect(mocks.saveSceneDungeon).not.toHaveBeenCalled();
});

test.each(['local', 'cloud'])('reimporting a room restores current conditions and HP from its %s fight', async (source) => {
  let combatants = [
    { id: 1, type: 'monster', name: 'Ogre', hpCurrent: 59, hpMax: 59, activeConditions: [] },
    { id: 2, type: 'monster', name: 'Dead ogre', hpCurrent: 0, hpMax: 59, isDead: true },
    { id: 3, type: 'player', name: 'Hero', hpCurrent: 20, hpMax: 20 },
  ];
  const entry = () => ({ id: 900, fight: { combatants } });
  mocks.readPersistedInstance.mockImplementation(() => ({ fightsData: { items: [entry()] } }));
  mocks.listInstanceFights.mockImplementation(async () => [entry()]);
  mocks.localFightPresence.mockReturnValue(source === 'local' ? 'present' : 'unknown');
  const { result } = await openDungeon();

  // Token edits update the fight. Removing map pieces leaves this saved state intact.
  combatants = fightWithTokenVitals(combatants, {
    sourceRef: 'enc_a:900:1', hpCurrent: 31, hpMax: 59, conditions: ['prone'],
  });
  let link;
  await act(async () => { link = await result.current.sendRoomToBuilder(1); });
  expect(link.fightId).toBe(900);
  expect(link.combatants).toHaveLength(1);
  expect(combatantToToken(link.combatants[0], link)).toMatchObject({
    conditions: ['prone'], hp_current: 31, hp_max: 59, source_ref: 'enc_a:900:1',
  });

  // Read again on every import, including when the panel stayed open during edits.
  combatants = fightWithTokenVitals(combatants, {
    sourceRef: 'enc_a:900:1', hpCurrent: 25, hpMax: 59, conditions: ['poisoned'],
  });
  await act(async () => { link = await result.current.sendRoomToBuilder(1); });
  expect(combatantToToken(link.combatants[0], link)).toMatchObject({
    conditions: ['poisoned'], hp_current: 25,
  });
  expect(mocks.sendEncounterToBuilder).not.toHaveBeenCalled();
  expect(mocks.saveInstanceFight).not.toHaveBeenCalled();
});

test('a failed cloud lookup does not create another encounter', async () => {
  mocks.listInstanceFights.mockRejectedValue(new Error('offline'));
  const { result } = await openDungeon();
  await act(async () => { expect(await result.current.sendRoomToBuilder(1)).toEqual(EXISTING); });
  expect(mocks.sendEncounterToBuilder).not.toHaveBeenCalled();
});

test('without cloud access an unknown fight is retained conservatively', async () => {
  mocks.auth = { cloudEnabled: false, status: 'guest' };
  const { result } = await openDungeon();
  await act(async () => { expect(await result.current.sendRoomToBuilder(1)).toEqual(EXISTING); });
  expect(mocks.listInstanceFights).not.toHaveBeenCalled();
  expect(mocks.sendEncounterToBuilder).not.toHaveBeenCalled();
});
