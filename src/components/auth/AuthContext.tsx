import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isSuperAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  checkSuperAdmin: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Check if user is superadmin
  const checkSuperAdminRole = async (currentUser: User | null): Promise<boolean> => {
    if (!currentUser) {
      setIsSuperAdmin(false);
      return false;
    }

    try {
      // Use the user data directly if available, otherwise fetch
      if (currentUser) {
        const isAdmin = currentUser.app_metadata?.role === 'superadmin';
        setIsSuperAdmin(isAdmin);
        return isAdmin;
      }
      setIsSuperAdmin(false);
      return false;
    } catch (error) {
      console.error('Error checking superadmin role:', error);
      setIsSuperAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      await checkSuperAdminRole(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      await checkSuperAdminRole(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    // Check if user is superadmin from the signed-in user data
    const isAdmin = data.user?.app_metadata?.role === 'superadmin';
    
    if (!isAdmin) {
      // Sign out the user if they're not a superadmin
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setIsSuperAdmin(false);
      throw new Error('Access denied. Only superadmin users can access the dashboard.');
    }
    
    setSession(data.session);
    setUser(data.user);
    setIsSuperAdmin(true);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setUser(null);
    setIsSuperAdmin(false);
  };

  const checkSuperAdmin = async (): Promise<boolean> => {
    return await checkSuperAdminRole(user);
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    setSession(data.session);
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isSuperAdmin, signIn, signOut, signUp, checkSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

