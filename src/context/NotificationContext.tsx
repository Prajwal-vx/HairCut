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
  const [notificationState, setNotificationState] = useState<{ userId: string | null; items: NotificationLog[] }>({ userId: null, items: [] });
  const notifications = user && notificationState.userId === user.id ? notificationState.items : [];
  const [loading, setLoading] = useState(false);

  const refreshNotifications = useCallback(async () => {
    if (!user) {
      setNotificationState({ userId: null, items: [] });
      return;
    }
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      setNotificationState({ userId: user.id, items: Array.isArray(res.notifications) ? res.notifications : [] });
    } catch {
      // Graceful fallback for offline / errors
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let isCancelled = false;
    notificationService
      .getNotifications()
      .then((res) => {
        if (!isCancelled) {
          setNotificationState({ userId: user.id, items: Array.isArray(res.notifications) ? res.notifications : [] });
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
      setNotificationState((state) => ({
        ...state,
        items: state.items.map((notification) => notification.id === id ? { ...notification, status: "read" } : notification),
      }));
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
