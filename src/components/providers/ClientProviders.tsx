"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ToastProvider>
          <NotificationProvider><Breadcrumbs />{children}</NotificationProvider>
        </ToastProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
