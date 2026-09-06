import { act, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useSceneContent } from '../../../../../src/pages/vtt/hooks/useSceneContent.js';

const cloud = vi.hoisted(() => ({
  listTokens: vi.fn(), listDrawings: vi.fn(), listTokenSecrets: vi.fn(),
  listCampaignCharacters: vi.fn(), readCampaignVitals: vi.fn(), signMapImage: vi.fn(),
}));
vi.mock('../../../../../src/shared/cloud/vtt.js', () => cloud);
vi.mock('../../../../../src/shared/cloud/campaigns.js', () => cloud);
vi.mock('../../../../../src/shared/campaign/characterVitals.js', () => ({
  readCampaignVitals: cloud.readCampaignVitals, mergeVitals: (roster) => roster,
}));

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}
beforeEach(() => {
  cloud.listTokens.mockReset().mockResolvedValue([]);
  cloud.listDrawings.mockResolvedValue([]);
  cloud.listTokenSecrets.mockResolvedValue({});
  cloud.listCampaignCharacters.mockResolvedValue([]);
  cloud.readCampaignVitals.mockReset().mockResolvedValue({});
});
function openScene() {
  const notify = vi.fn();
  return {
    notify,
    ...renderHook(() => useSceneContent({
      scene: { id: 'scene', campaignId: 'campaign' }, isGm: true, spectator: false, notify,
    })),
  };
}

test('a reconnect finishing before the initial load releases the spinner and wins', async () => {
  const initial = deferred();
  cloud.listTokens.mockReturnValueOnce(initial.promise)
    .mockResolvedValueOnce([{ id: 'fresh' }]);
  const { result } = openScene();
  expect(result.current.loading).toBe(true);
  await act(async () => { await result.current.refreshContent(); });
  expect(result.current.loading).toBe(false);
  expect(result.current.tokens).toEqual([{ id: 'fresh' }]);
  await act(async () => initial.resolve([{ id: 'stale' }]));
  expect(result.current.tokens).toEqual([{ id: 'fresh' }]);
});

test('a failed reconnect also releases an initial spinner', async () => {
  cloud.listTokens.mockReturnValueOnce(new Promise(() => {}))
    .mockRejectedValueOnce(new Error('Offline'));
  const { result, notify } = openScene();
  await act(async () => { await result.current.refreshContent(); });
  expect(result.current.loading).toBe(false);
  expect(notify).toHaveBeenCalledWith('error', 'Offline');
});

test('optional character vitals do not block a ready map', async () => {
  cloud.readCampaignVitals.mockReturnValue(new Promise(() => {}));
  const { result } = openScene();
  await waitFor(() => expect(result.current.loading).toBe(false));
});
