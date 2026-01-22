import { createContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; data?: unknown; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; data?: unknown; error?: string }>;
  signOut: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; data?: unknown; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Escuchar cambios en la autenticación (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Error during sign up:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Error during sign in:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resendVerificationEmail = async (email: string) => {
    const { data, error } = await supabase.auth.resend({
      email: email,
      type: 'signup',
    });

    if (error) {
      console.error('Error during resend verification email:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      console.error('Error during Google sign in:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  return <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut, resendVerificationEmail, signInWithGoogle }} children={children} />;
}
