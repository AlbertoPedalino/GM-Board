import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { EncounterBuilderProvider, useEncounterBuilder } from '../../../../../src/pages/encounterbuilder/state/EncounterBuilderContext.jsx';
import EncounterList from '../../../../../src/pages/encounterbuilder/builder/EncounterList.jsx';
import LibraryView from '../../../../../src/pages/encounterbuilder/library/LibraryView.jsx';

vi.mock('../../../../../src/pages/encounterbuilder/state/useEncounterPersistence.js', () => ({ useEncounterPersistence: () => ({}) }));
vi.mock('../../../../../src/pages/encounterbuilder/bestiary/useMonsterDb.js', () => ({
  useMonsterDb: () => ({ monsters: [{ name: 'Goblin', source: 'MM', cr: '1/4' }] }),
}));
vi.mock('../../../../../src/pages/encounterbuilder/campaign/useCampaignPlayers.js', () => ({ useCampaignPlayers: () => ({ campaigns: [] }) }));
vi.mock('../../../../../src/pages/encounterbuilder/campaign/useFightSheetSync.js', () => ({ useFightSheetSync: () => ({}) }));
vi.mock('../../../../../src/pages/encounterbuilder/campaign/useSheetRealtime.js', () => ({ useSheetRealtime: () => {} }));
vi.mock('../../../../../src/pages/encounterbuilder/sync/useExternalFightSync.js', () => ({ useExternalFightSync: () => {} }));
vi.mock('../../../../../src/pages/encounterbuilder/sync/useMapTokenBridge.js', () => ({ useMapTokenBridge: () => {} }));
vi.mock('../../../../../src/pages/encounterbuilder/sync/useCloudFights.js', () => ({ useCloudFights: () => {} }));
vi.mock('../../../../../src/pages/encounterbuilder/rolls/useEncounterRolls.js', () => ({ useEncounterRolls: () => ({}) }));
vi.mock('../../../../../src/shared/ui/ToastProvider.jsx', () => ({ useToast: () => ({ notify: vi.fn() }) }));

const original = {
  id: 7, name: 'Road ambush', quest: 'Old Road', createdAt: '2025-01-01T00:00:00.000Z',
  encounter: [{ id: 'goblin', name: 'Goblin', source: 'MM', qty: 1 }],
};

function Harness() {
  const { state, dispatch } = useEncounterBuilder();
  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'hydrateStorage', payload: { library: [original] }, monsters: [] });
        dispatch({ type: 'setView', view: 'library' });
      }}>Open saved library</button>
      <button onClick={() => dispatch({ type: 'setView', view: 'library' })}>Show library</button>
      <output data-testid="state">{JSON.stringify(state)}</output>
      {state.view === 'library' ? <LibraryView /> : <EncounterList />}
    </>
  );
}

test('Library Load edits the same encounter, repeated saves update it, and Save as New copies it', async () => {
  const user = userEvent.setup();
  render(<EncounterBuilderProvider instanceId="test" instanceSaved><Harness /></EncounterBuilderProvider>);
  await user.click(screen.getByRole('button', { name: 'Open saved library' }));
  await user.click(screen.getByRole('button', { name: 'Load' }));
  await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
  fireEvent.change(screen.getByRole('textbox', { name: 'Library name' }), { target: { value: 'Larger ambush' } });
  await user.click(screen.getByRole('button', { name: 'Update in Library' }));
  const readState = () => JSON.parse(screen.getByTestId('state').textContent);
  expect(readState().library).toHaveLength(1);
  expect(readState().library[0]).toMatchObject({ id: 7, name: 'Larger ambush', createdAt: original.createdAt });
  expect(readState().library[0].encounter[0].qty).toBe(2);
  expect(screen.getByRole('textbox', { name: 'Library name' })).toHaveValue('Larger ambush');
  await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
  await user.click(screen.getByRole('button', { name: 'Update in Library' }));
  expect(readState().library).toHaveLength(1);
  expect(readState().library[0].encounter[0].qty).toBe(3);
  await user.click(screen.getByRole('button', { name: 'Save as New' }));
  const copied = readState();
  expect(copied.library).toHaveLength(2);
  expect(copied.currentEncounterId).not.toBe(7);
  expect(copied.library[1].id).toBe(7);
  await user.click(screen.getByRole('button', { name: 'Show library' }));
  expect(screen.getAllByRole('button', { name: 'Load' })).toHaveLength(2);
});
