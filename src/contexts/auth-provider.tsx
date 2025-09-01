"use client";

import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithOtp: (email: string) => Promise<{ error: Error | null }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithPassword: (email: string, password: string, username: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPasswordForEmail: (email: string, redirectTo?: string) => Promise<{ error: Error | null }>;
  updateUserPassword: (newPassword: string) => Promise<{ error: Error | null }>;
  checkUsernameExists: (username: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [supabase]);

  const value: AuthContextState = {
    user,
    session,
    loading,
    async signInWithOtp(email: string) {
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
      return { error: error ?? null };
    },
    async signInWithPassword(email: string, password: string) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error ?? null };
    },
    async checkUsernameExists(username: string) {
      try {
        // Kullanıcı adı kontrolü yap
        const { data, error } = await supabase
          .from('user_profile')
          .select('username')
          .ilike('username', username)
          .limit(1);
        
        if (error) {
          console.error("Kullanıcı adı kontrolü hatası:", error);
          throw error;
        }
        
        // Eğer veri varsa kullanıcı adı zaten kullanımda
        return data && data.length > 0;
      } catch (error) {
        console.error("Kullanıcı adı kontrolü başarısız:", error);
        return false; // Hata durumunda güvenli tarafta kal
      }
    },
    async signUpWithPassword(email: string, password: string, username: string, fullName?: string) {
      try {
        // 1. Önce kullanıcı adının kullanımda olup olmadığını kontrol et
        const usernameExists = await value.checkUsernameExists(username);
        if (usernameExists) {
          throw new Error("Bu kullanıcı adı zaten kullanımda");
        }
        
        // 2. Kullanıcıyı auth.users tablosuna kaydet
        const { data: authData, error: authError } = await supabase.auth.signUp({ 
          email, 
          password, 
          options: { 
            emailRedirectTo: window.location.origin,
            data: {
              username,
              full_name: fullName || null
            }
          } 
        });
        
        if (authError) throw authError;
        
        // 3. Kullanıcı başarıyla oluşturulduysa user_profile tablosuna kaydet
        if (authData.user) {
          const { error: profileError } = await supabase.from('user_profile').insert({
            user_id: authData.user.id,
            username: username,
            full_name: fullName || null
          });
          
          if (profileError) {
            console.error("Profil oluşturma hatası:", profileError);
            // Profil oluşturulamadıysa, auth kullanıcısını da sil
            await supabase.auth.admin.deleteUser(authData.user.id);
            throw new Error("Profil oluşturulamadı: " + profileError.message);
          }
        }
        
        return { error: null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    async signOut() {
      const { error } = await supabase.auth.signOut();
      return { error: error ?? null };
    },
    async resetPasswordForEmail(email: string, redirectTo?: string) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo ?? `${window.location.origin}/reset-password`,
      });
      return { error: error ?? null };
    },
    async updateUserPassword(newPassword: string) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      return { error: error ?? null };
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth, AuthProvider içinde kullanılmalıdır");
  return ctx;
}