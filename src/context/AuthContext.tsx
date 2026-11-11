"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { authService, RegisterPayload } from "@/services/authService";
import type { AuthSessionUser } from "@/types";

interface AuthContextType {
  user: AuthSessionUser | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AuthSessionUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const authRevision = useRef(0);

  const refreshUser = useCallback(async () => {
    const revision = ++authRevision.current;
    try {
      const data = await authService.getMe();
      if (authRevision.current === revision) setUser(data.user || null);
    } catch {
      if (authRevision.current === revision) setUser(null);
    } finally {
      if (authRevision.current === revision) setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;
    if (status === "loading") {
      return;
    }
    const revision = ++authRevision.current;

    authService
      .getMe()
      .then((data) => {
        if (!isCancelled && authRevision.current === revision) {
          setUser(data.user || null);
        }
      })
      .catch(() => {
        if (!isCancelled && authRevision.current === revision) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!isCancelled && authRevision.current === revision) {
          setIsAuthLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [status, session]);

  const loading = status === "loading" || isAuthLoading;

  const login = async (identifier: string, password: string) => {
    const revision = ++authRevision.current;
    try {
      const data = await authService.login({ identifier, password });
      if (!data.success) {
        return { success: false, error: data.error || "Login failed" };
      }
      if (authRevision.current === revision) setUser(data.user ?? null);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid credentials";
      return { success: false, error: message };
    }
  };

  const register = async (formData: RegisterPayload) => {
    const revision = ++authRevision.current;
    try {
      const data = await authService.register(formData);
      if (!data.success) {
        return { success: false, error: data.error || "Registration failed" };
      }
      if (authRevision.current === revision) setUser(data.user ?? null);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    ++authRevision.current;
    setUser(null);
    try {
      await authService.logout();
    } catch {
      // Continue local sign-out and navigation when the server is unavailable.
    }
    try {
      await signOut({ redirect: false });
    } catch {
      // A failed NextAuth sign-out must not strand the user on the current page.
    } finally {
      ++authRevision.current;
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
