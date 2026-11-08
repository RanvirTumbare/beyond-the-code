import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  isOfflineMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if current authenticated user has an entry in admin_users
  const verifyAdminStatus = useCallback(async (userId: string): Promise<boolean> => {
    if (!isSupabaseConfigured) {
      // In offline/mock mode, treat authenticated state as admin
      return true;
    }
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error verifying admin status:', error);
        return false;
      }
      return Boolean(data);
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      setIsLoading(true);

      // Check offline mode mock session in localStorage
      if (!isSupabaseConfigured) {
        const mockAdmin = localStorage.getItem('btc_mock_admin_session');
        if (mockAdmin === 'true') {
          const fakeUser = {
            id: 'mock-admin-id',
            email: 'admin@beyondthecode.local',
            app_metadata: {},
            user_metadata: { name: 'Ranvir (Admin)' },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as unknown as User;

          setUser(fakeUser);
          setSession({
            user: fakeUser,
            access_token: 'mock-token',
            refresh_token: 'mock-refresh',
            expires_in: 3600,
            token_type: 'bearer',
          } as unknown as Session);
          setIsAdmin(true);
        }
        setIsLoading(false);
        return;
      }

      // Live Supabase Auth
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            const adminStatus = await verifyAdminStatus(session.user.id);
            setIsAdmin(adminStatus);
          } else {
            setIsAdmin(false);
          }
        }
      } catch (err) {
        console.warn('Error fetching Supabase auth session:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, newSession) => {
          if (!mounted) return;
          setSession(newSession);
          setUser(newSession?.user ?? null);
          if (newSession?.user) {
            const adminStatus = await verifyAdminStatus(newSession.user.id);
            setIsAdmin(adminStatus);
          } else {
            setIsAdmin(false);
          }
          setIsLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [verifyAdminStatus]);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        // Offline / preview mode simulation
        if (email.trim() && password.length >= 6) {
          localStorage.setItem('btc_mock_admin_session', 'true');
          const fakeUser = {
            id: 'mock-admin-id',
            email: email.trim(),
            app_metadata: {},
            user_metadata: { name: 'Ranvir (Admin)' },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as unknown as User;
          setUser(fakeUser);
          setSession({
            user: fakeUser,
            access_token: 'mock-token',
            refresh_token: 'mock-refresh',
            expires_in: 3600,
            token_type: 'bearer',
          } as unknown as Session);
          setIsAdmin(true);
          return { success: true };
        } else {
          return { success: false, error: 'Password must be at least 6 characters.' };
        }
      }

      // Live Supabase signInWithPassword
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'User account not found.' };
      }

      // Check if user is in admin_users
      const adminVerified = await verifyAdminStatus(data.user.id);
      if (!adminVerified) {
        // Sign out right away if not registered as admin
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Access restricted: Your account does not have administrator privileges in admin_users.',
        };
      }

      setIsAdmin(true);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      return { success: false, error: msg };
    }
  };

  const signOut = async () => {
    try {
      if (!isSupabaseConfigured) {
        localStorage.removeItem('btc_mock_admin_session');
      } else {
        await supabase.auth.signOut();
      }
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    } catch (err) {
      console.warn('Sign out error:', err);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        return { success: true };
      }
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Password reset failed';
      return { success: false, error: msg };
    }
  };

  const updatePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        return { success: true };
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Password update failed';
      return { success: false, error: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isLoading,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        isOfflineMode: !isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
