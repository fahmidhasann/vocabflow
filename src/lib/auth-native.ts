import type { PluginListenerHandle } from '@capacitor/core';
import { createClient } from '@/lib/supabase/client';

let listenerHandle: PluginListenerHandle | null = null;

export async function setupNativeAuthListener() {
  if (listenerHandle) return;

  const { App } = await import('@capacitor/app');
  const { Browser } = await import('@capacitor/browser');

  listenerHandle = await App.addListener('appUrlOpen', async ({ url }) => {
    if (!url.includes('auth/callback')) return;

    await Browser.close();

    // Supabase puts tokens in the URL fragment or as query params depending on flow.
    // Pass the full URL to the client so it can detect and set the session.
    const supabase = createClient();

    // Extract code from query params (PKCE flow)
    const urlObj = new URL(url);
    const code = urlObj.searchParams.get('code');

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        window.location.href = '/';
        return;
      }
    }

    // Fallback: let Supabase parse hash fragments (implicit flow)
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      window.location.href = '/';
    } else {
      window.location.href = '/login?error=auth_failed';
    }
  });
}

export function teardownNativeAuthListener() {
  listenerHandle?.remove();
  listenerHandle = null;
}
