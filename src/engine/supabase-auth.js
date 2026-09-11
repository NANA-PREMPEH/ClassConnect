import { getSupabaseClient } from './supabase-client.js';

export function isSupabaseAuthConfigured() {
  return !!getSupabaseClient();
}

export async function signInWithSupabase(email, password, expectedRole) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase is not configured for this environment.');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) throw new Error(error?.message || 'Unable to sign in.');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, school_id, role, display_name')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    throw new Error('Your account is not assigned to a ClassConnect school. Ask an administrator for access.');
  }
  if (expectedRole && profile.role !== expectedRole) {
    await supabase.auth.signOut();
    throw new Error('This account does not have access to this workspace.');
  }
  return profile;
}

export async function signOutFromSupabase() {
  await getSupabaseClient()?.auth.signOut();
}
