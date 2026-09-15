import { createClient } from '@supabase/supabase-js';

let supabaseClient = null;

/** Creates a browser client with public Supabase configuration only. */
export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  // Validate that the URL is a real Supabase endpoint, not a placeholder.
  try {
    const parsed = new URL(url);
    if (!parsed.protocol.startsWith('http')) return null;
  } catch {
    return null;
  }

  try {
    supabaseClient = createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
  } catch (err) {
    console.warn('ClassConnect: Supabase client could not be created — running in offline mode.', err);
    return null;
  }
  return supabaseClient;
}
