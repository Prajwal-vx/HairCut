"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

import { UserRole } from "@/lib/types";

interface UserType {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  loyaltyPoints: number;
  styleStreak: number;
  lastVisitDate: string | null;
  profilePhotoUrl?: string;
  referralCode: string;
  preferredChannel: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

interface RegisterData {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  gender?: string;
  preferredChannel?: string;
  referralCodeInput?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    if (status === "loading") {
      return;
    }

    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        if (!ignore) {
          setUser(data.user || null);
        }
      } catch {
        if (!ignore) {
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setIsAuthLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      ignore = true;
    };
  }, [status, session]);

  const loading = status === "loading" || isAuthLoading;


  const login = async (identifier: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || "Login failed" };
    setUser(data.user ?? null);
    return { success: true };
  };

  const register = async (formData: RegisterData) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || "Registration failed" };
    setUser(data.user ?? null);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    signOut({ callbackUrl: "/" });
    fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
