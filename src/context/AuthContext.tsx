"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile, UserRole } from "@/types/auth";
import { defaultUsers } from "@/lib/storage";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (
    email: string,
    pass: string,
    displayName: string
  ) => Promise<{ success: boolean; needsVerification?: boolean; error?: string }>;
  loginWithMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  quickLoginAs: (targetRole: "admin" | "viewer" | "guest") => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "resepify_active_user_v1";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "edgarchuang343@gmail.com")
  .toLowerCase()
  .split(",")
  .map((e) => e.trim());

export function isUserAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync session with Supabase & LocalStorage
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            // Fetch profile from supabase profiles table
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            const userEmail = session.user.email || "";
            const activeUser: UserProfile = {
              id: session.user.id,
              email: userEmail,
              display_name:
                profile?.display_name ||
                session.user.user_metadata?.display_name ||
                session.user.user_metadata?.full_name ||
                userEmail.split("@")[0] ||
                "Pengguna",
              avatar_url:
                profile?.avatar_url ||
                session.user.user_metadata?.avatar_url ||
                `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
                  userEmail || "user"
                )}`,
              role: isUserAdminEmail(userEmail) ? "admin" : (profile?.role || "viewer"),
              status: "active",
              created_at: session.user.created_at || new Date().toISOString(),
            };

            setUser(activeUser);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(activeUser));
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error("Supabase getSession error:", e);
        }
      }

      // Fallback: check localStorage
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored && isMounted) {
          setUser(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Auth restore error", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initAuth();

    // Listen to Supabase auth events
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await client
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          const userEmail = session.user.email || "";
          const activeUser: UserProfile = {
            id: session.user.id,
            email: userEmail,
            display_name:
              profile?.display_name ||
              session.user.user_metadata?.display_name ||
              session.user.user_metadata?.full_name ||
              userEmail.split("@")[0] ||
              "Pengguna",
            avatar_url:
              profile?.avatar_url ||
              session.user.user_metadata?.avatar_url ||
              `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
                userEmail || "user"
              )}`,
            role: isUserAdminEmail(userEmail) ? "admin" : (profile?.role || "viewer"),
            status: "active",
            created_at: session.user.created_at || new Date().toISOString(),
          };

          setUser(activeUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(activeUser));
        } else {
          // Signed out
          setUser(null);
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const saveUserSession = (newUser: UserProfile | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  // Login with Email & Password
  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: pass,
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          const userEmail = data.user.email || email.trim();
          const activeUser: UserProfile = {
            id: data.user.id,
            email: userEmail,
            display_name:
              profile?.display_name ||
              data.user.user_metadata?.display_name ||
              userEmail.split("@")[0],
            avatar_url:
              profile?.avatar_url ||
              `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(userEmail)}`,
            role: isUserAdminEmail(userEmail) ? "admin" : (profile?.role || "viewer"),
            status: "active",
            created_at: data.user.created_at || new Date().toISOString(),
          };

          saveUserSession(activeUser);
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: unknown) {
        console.error("Supabase signInWithPassword error:", err);
      }
    }

    // Local fallback simulation
    await new Promise((r) => setTimeout(r, 400));
    const normalizedEmail = email.trim().toLowerCase();
    if (isUserAdminEmail(normalizedEmail)) {
      saveUserSession({
        ...defaultUsers[0],
        email: normalizedEmail,
      });
    } else {
      const viewerUser: UserProfile = {
        id: "usr-" + Date.now().toString(36),
        email: email.trim(),
        display_name: email.split("@")[0].replace(/[._-]/g, " "),
        avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(email)}`,
        role: "viewer",
        status: "active",
        created_at: new Date().toISOString(),
      };
      saveUserSession(viewerUser);
    }
    setIsLoading(false);
    return { success: true };
  };

  // Sign Up / Create Account with Email
  const signUpWithEmail = async (
    email: string,
    pass: string,
    displayName: string
  ): Promise<{ success: boolean; needsVerification?: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: pass,
          options: {
            data: {
              display_name: displayName.trim(),
            },
            emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
          },
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        // If user is returned and identities are empty or user has no session, verification email was sent
        if (data.user && (!data.session || data.user.identities?.length === 0)) {
          setIsLoading(false);
          return { success: true, needsVerification: true };
        }

        // If session exists immediately (e.g. email confirmations disabled in Supabase)
        if (data.session && data.user) {
          const userEmail = email.trim();
          const newUser: UserProfile = {
            id: data.user.id,
            email: userEmail,
            display_name: displayName.trim(),
            avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(userEmail)}`,
            role: isUserAdminEmail(userEmail) ? "admin" : "viewer",
            status: "active",
            created_at: new Date().toISOString(),
          };
          saveUserSession(newUser);
          setIsLoading(false);
          return { success: true, needsVerification: false };
        }

        setIsLoading(false);
        return { success: true, needsVerification: true };
      } catch (err: unknown) {
        setIsLoading(false);
        const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat pendaftaran";
        return { success: false, error: msg };
      }
    }

    // Local fallback: simulate email verification requirement
    await new Promise((r) => setTimeout(r, 500));
    setIsLoading(false);
    return { success: true, needsVerification: true };
  };

  // Login with Magic Link
  const loginWithMagicLink = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: {
            emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
          },
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        console.error("Magic link error:", err);
      }
    }

    // Local fallback
    await new Promise((r) => setTimeout(r, 600));
    const userEmail = email.trim();
    const isOwner = isUserAdminEmail(userEmail);
    const targetUser = isOwner
      ? { ...defaultUsers[0], email: userEmail }
      : {
          id: "usr-" + Date.now().toString(36),
          email: userEmail,
          display_name: userEmail.split("@")[0].replace(/[._-]/g, " "),
          avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(userEmail)}`,
          role: "viewer" as UserRole,
          status: "active" as const,
          created_at: new Date().toISOString(),
        };

    saveUserSession(targetUser);
    setIsLoading(false);
    return { success: true };
  };

  // Login with Google OAuth
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
          },
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        return { success: true };
      } catch (err: unknown) {
        setIsLoading(false);
        const msg = err instanceof Error ? err.message : "Gagal menginisialisasi Google OAuth";
        return { success: false, error: msg };
      }
    }

    // Fallback simulation
    await new Promise((r) => setTimeout(r, 500));
    saveUserSession(defaultUsers[1]);
    setIsLoading(false);
    return { success: true };
  };

  const quickLoginAs = (targetRole: "admin" | "viewer" | "guest") => {
    if (targetRole === "guest") {
      saveUserSession(null);
    } else if (targetRole === "admin") {
      saveUserSession(defaultUsers[0]);
    } else {
      saveUserSession(defaultUsers[1]);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error("Supabase signOut error:", e);
      }
    }
    saveUserSession(null);
  };

  const role: UserRole = user ? user.role : "guest";
  const isAuthenticated = Boolean(user);
  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isAdmin,
        isLoading,
        loginWithEmail,
        signUpWithEmail,
        loginWithMagicLink,
        loginWithGoogle,
        quickLoginAs,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
