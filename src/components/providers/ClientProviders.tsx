"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SiteUtilities from "@/components/layout/SiteUtilities";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ToastProvider>
          <NotificationProvider>
            <a href="#main-content" className="skip-link" onClick={(event) => {
              event.preventDefault();
              const main = document.querySelector<HTMLElement>("main");
              if (!main) return;
              main.id = "main-content";
              main.tabIndex = -1;
              main.focus({ preventScroll: true });
              main.scrollIntoView({ behavior: "smooth", block: "start" });
            }}>Skip to content</a>
            <SiteUtilities />
            <div>
              <Breadcrumbs />
              {children}
            </div>
          </NotificationProvider>
        </ToastProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
