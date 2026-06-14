import { supabase } from './supabase';

// Sign up a new user
export async function signUp({ email, password, fullName, department, role = 'employee' }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        department,
        role,
      },
    },
  });
  if (error) throw error;
  return data;
}

// Sign in
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Get current session
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// Get current user profile from profiles table
export async function getCurrentProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
}

// Update profile
export async function updateProfile(updates) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Listen to auth state changes
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}
