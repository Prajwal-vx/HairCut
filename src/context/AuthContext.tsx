"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { authService, RegisterPayload } from "@/services/authService";
import type { AuthSessionUser } from "@/types";

interface AuthContextType {
  user: AuthSessionUser | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AuthSessionUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await authService.getMe();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;
    if (status === "loading") {
      return;
    }

    authService
      .getMe()
      .then((data) => {
        if (!isCancelled) {
          setUser(data.user || null);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsAuthLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [status, session]);

  const loading = status === "loading" || isAuthLoading;

  const login = async (identifier: string, password: string) => {
    try {
      const data = await authService.login({ identifier, password });
      if (!data.success) {
        return { success: false, error: data.error || "Login failed" };
      }
      setUser(data.user ?? null);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid credentials";
      return { success: false, error: message };
    }
  };

  const register = async (formData: RegisterPayload) => {
    try {
      const data = await authService.register(formData);
      if (!data.success) {
        return { success: false, error: data.error || "Registration failed" };
      }
      setUser(data.user ?? null);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    signOut({ callbackUrl: "/" });
    authService.logout().catch(() => {});
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
