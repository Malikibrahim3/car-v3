/**
 * Supabase Client Configuration
 * 
 * This file initializes the Supabase client for the frontend application.
 * Uses environment variables for configuration.
 */

import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get env variables from Expo config or process.env
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// For now, use demo mode if no Supabase credentials
const useDemoMode = !supabaseUrl || !supabaseAnonKey;

if (useDemoMode) {
  console.warn('⚠️ Running in DEMO MODE - No Supabase credentials found');
  console.warn('Add credentials to app.json extra config or .env file');
}

// Create a dummy client for demo mode
const dummyClient = {
  auth: {
    signIn: async () => ({ data: null, error: { message: 'Demo mode - auth disabled' } }),
    signUp: async () => ({ data: null, error: { message: 'Demo mode - auth disabled' } }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: async () => ({ data: [], error: null }),
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
    delete: async () => ({ data: null, error: null }),
  }),
};

export const supabase = useDemoMode ? dummyClient : createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper function to check connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('vehicles').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection error:', error);
      return { success: false, error };
    }
    
    console.log('✅ Supabase connected successfully');
    return { success: true, data };
  } catch (err) {
    console.error('Supabase connection failed:', err);
    return { success: false, error: err };
  }
};

export default supabase;
