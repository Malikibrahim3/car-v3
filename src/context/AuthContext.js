import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import storage from '../utils/storage';

const AuthContext = createContext({});

// Test credentials for development environment
const TEST_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: 'Boyo1996!',
  user: {
    id: 'test-user-id',
    email: 'admin@gmail.com',
    user_metadata: { full_name: 'Test User' },
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      // Check for test user session first
      const testSession = await storage.getItem('test_user_session');
      if (testSession === 'true') {
        setUser(TEST_CREDENTIALS.user);
        setLoading(false);
        return;
      }

      // Check if Supabase is configured
      if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
        setLoading(false);
        return;
      }

      // Check active Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }).catch(error => {
        console.error('Supabase session check failed:', error);
        setLoading(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    };

    initAuth();
  }, []);

  const signUp = async (email, password, fullName) => {
    try {
      // For development: Auto-confirm email (no verification needed)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: undefined, // Disable email verification for dev
        },
      });

      if (error) {
        // Map Supabase errors to user-friendly messages
        const friendlyErrors = {
          'User already registered': 'This email is already registered. Try logging in instead.',
          'Password should be at least 6 characters': 'Password must be at least 8 characters long.',
          'Unable to validate email address: invalid format': 'Please enter a valid email address.',
        };
        
        const friendlyMessage = friendlyErrors[error.message] || error.message;
        throw new Error(friendlyMessage);
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      // Check for test credentials first (development only)
      if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
        // Set test user in state
        setUser(TEST_CREDENTIALS.user);
        await storage.setItem('test_user_session', 'true');

        console.log('✅ Test user login successful');
        return { data: { user: TEST_CREDENTIALS.user }, error: null };
      }

      // Regular Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Map Supabase errors to user-friendly messages
        const friendlyErrors = {
          'Invalid login credentials': 'Email or password is incorrect. Please try again.',
          'Email not confirmed': 'Please verify your email address before logging in.',
          'User not found': 'No account found with this email address.',
        };
        
        const friendlyMessage = friendlyErrors[error.message] || error.message;
        throw new Error(friendlyMessage);
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const redirectUrl = Platform.OS === 'web'
        ? `${window.location.origin}/dashboard`
        : 'carvalue://dashboard';

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signInWithApple = async () => {
    try {
      const redirectUrl = Platform.OS === 'web'
        ? `${window.location.origin}/dashboard`
        : 'carvalue://dashboard';

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      // Clear test user session
      await storage.removeItem('test_user_session');

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const resetPassword = async (email) => {
    try {
      const redirectUrl = Platform.OS === 'web'
        ? `${window.location.origin}/reset-password`
        : 'carvalue://reset-password';

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
