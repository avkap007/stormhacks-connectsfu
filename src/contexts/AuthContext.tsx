"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: { name: string }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isSFUUser: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Check if email is SFU email
    if (!email.endsWith('@sfu.ca')) {
      return { error: { message: 'Please use your SFU email address' } };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, metadata?: { name: string }) => {
    // Check if email is SFU email
    if (!email.endsWith('@sfu.ca')) {
      return { error: { message: 'Please use your SFU email address' } };
    }

    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: metadata
      }
    });

    // If signup successful and user is confirmed, create user profile
    if (data.user && !error) {
      try {
        // Create user profile in a custom table (if you want to store additional user data)
        // For now, the user data is stored in auth.users automatically by Supabase
        console.log('User created successfully:', data.user);
      } catch (profileError) {
        console.error('Error creating user profile:', profileError);
        // Don't fail the signup if profile creation fails
      }
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isSFUUser = user?.email?.endsWith('@sfu.ca') ?? false;

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isSFUUser,
    showAuthModal,
    setShowAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

