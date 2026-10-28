"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile, UserRole } from "@/types/auth";
import { defaultUsers } from "@/lib/storage";

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  quickLoginAs: (targetRole: "admin" | "viewer" | "guest") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "resepify_active_user_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore user session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default to viewer for quick initial exploration if desired, or guest as per PRD
        // PRD: Guest is visitor who has not logged in
        setUser(null);
      }
    } catch (err) {
      console.error("Auth restore error", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUserSession = (newUser: UserProfile | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const loginWithEmail = async (email: string, _pass: string): Promise<{ success: boolean; error?: string }> => {
    void _pass;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // smooth natural feedback

    // Check if matches admin email or standard user
    if (email.toLowerCase().includes("admin")) {
      const adminUser = defaultUsers[0];
      saveUserSession(adminUser);
      setIsLoading(false);
      return { success: true };
    }

    // Default registered viewer
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
    setIsLoading(false);
    return { success: true };
  };

  const loginWithMagicLink = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    // Simulate sending link & auto-authenticating viewer
    const isOwner = email.toLowerCase().includes("admin");
    const targetUser = isOwner ? defaultUsers[0] : {
      id: "usr-" + Date.now().toString(36),
      email: email.trim(),
      display_name: email.split("@")[0].replace(/[._-]/g, " "),
      avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(email)}`,
      role: "viewer" as UserRole,
      status: "active" as const,
      created_at: new Date().toISOString(),
    };

    saveUserSession(targetUser);
    setIsLoading(false);
    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const googleUser = defaultUsers[1]; // Sarah Penggemar Masak
    saveUserSession(googleUser);
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

  const logout = () => {
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
