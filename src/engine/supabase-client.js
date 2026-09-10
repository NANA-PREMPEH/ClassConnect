import { createClient } from '@supabase/supabase-js';

let supabaseClient = null;

/** Creates a browser client with public Supabase configuration only. */
export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  supabaseClient = createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  return supabaseClient;
}
