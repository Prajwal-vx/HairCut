"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { notificationService } from "@/services/notificationService";
import { useAuth } from "./AuthContext";
import type { NotificationLog } from "@/lib/types";

interface NotificationContextType {
  notifications: NotificationLog[];
  unreadCount: number;
  loading: boolean;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      setNotifications(res.notifications || []);
    } catch {
      // Graceful fallback for offline / errors
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    let isCancelled = false;
    notificationService
      .getNotifications()
      .then((res) => {
        if (!isCancelled) {
          setNotifications(res.notifications || []);
        }
      })
      .catch(() => {
        // Graceful fallback for offline / errors
      });

    return () => {
      isCancelled = true;
    };
  }, [user]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
      );
    } catch {
      // Ignored
    }
  }, []);

  const unreadCount = notifications.filter((n) => n.status !== "read").length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        refreshNotifications,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return ctx;
}
