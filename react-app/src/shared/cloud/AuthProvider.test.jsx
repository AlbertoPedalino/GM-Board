import { act, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthProvider.jsx';

const cloud = vi.hoisted(() => ({
  getSession: vi.fn(), onAuthStateChange: vi.fn(), from: vi.fn(),
}));
vi.mock('./supabaseClient.js', () => ({
  supabase: { auth: cloud, from: cloud.from },
  isCloudConfigured: () => true,
  usernameToEmail: (value) => value,
}));

let onAuth;
function Probe() {
  const auth = useAuth();
  return <div>{auth.status}:{auth.user?.id}:{auth.profile?.username}</div>;
}
function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}
beforeEach(() => {
  cloud.getSession.mockReset().mockResolvedValue({ data: { session: null } });
  cloud.onAuthStateChange.mockImplementation((callback) => {
    onAuth = callback;
    return { data: { subscription: { unsubscribe: vi.fn() } } };
  });
  cloud.from.mockReset().mockImplementation(() => ({
    select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { username: 'Aria' } }) }) }),
  }));
});

test('session refresh starts profile requests only after the auth notification returns', async () => {
  render(<AuthProvider><Probe /></AuthProvider>);
  await screen.findByText('anon::');
  act(() => {
    onAuth('TOKEN_REFRESHED', { user: { id: 'aria' } });
    expect(cloud.from).not.toHaveBeenCalled();
  });
  await screen.findByText('authed:aria:Aria');
});

test('a delayed initial session and profile cannot restore a signed-out user', async () => {
  const session = deferred();
  const profile = deferred();
  cloud.getSession.mockReturnValue(session.promise);
  cloud.from.mockImplementation(() => ({
    select: () => ({ eq: () => ({ maybeSingle: () => profile.promise }) }),
  }));
  render(<AuthProvider><Probe /></AuthProvider>);
  act(() => onAuth('SIGNED_IN', { user: { id: 'aria' } }));
  await waitFor(() => expect(cloud.from).toHaveBeenCalledOnce());
  act(() => onAuth('SIGNED_OUT', null));
  await act(async () => {
    session.resolve({ data: { session: { user: { id: 'aria' } } } });
    profile.resolve({ data: { username: 'Aria' } });
  });
  expect(screen.getByText('anon::')).toBeInTheDocument();
});

test('a rejected initial session leaves the loading state', async () => {
  cloud.getSession.mockRejectedValue(new Error('Connection lost'));
  render(<AuthProvider><Probe /></AuthProvider>);
  await screen.findByText('anon::');
});
