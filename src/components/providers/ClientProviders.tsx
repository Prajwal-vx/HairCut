"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { MotionConfig } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SiteUtilities from "@/components/layout/SiteUtilities";

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
};
type PerformanceNavigator = Navigator & { connection?: NetworkInformation; deviceMemory?: number };

function getLowPowerPreference() {
  if (typeof navigator === "undefined") return false;
  const browser = navigator as PerformanceNavigator;
  const connection = browser.connection;
  return Boolean(
    connection?.saveData ||
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "3g" ||
    (browser.hardwareConcurrency > 0 && browser.hardwareConcurrency <= 2) ||
    (browser.deviceMemory !== undefined && browser.deviceMemory <= 2)
  );
}

function subscribeToLowPowerPreference(onChange: () => void) {
  if (typeof navigator === "undefined") return () => {};
  const connection = (navigator as PerformanceNavigator).connection;
  connection?.addEventListener?.("change", onChange);
  return () => connection?.removeEventListener?.("change", onChange);
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const lowPower = useSyncExternalStore(subscribeToLowPowerPreference, getLowPowerPreference, () => false);

  useEffect(() => {
    document.documentElement.dataset.lowPower = String(lowPower);
  }, [lowPower]);

  return (
    <MotionConfig reducedMotion={lowPower ? "always" : "user"}>
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
    </MotionConfig>
  );
}
