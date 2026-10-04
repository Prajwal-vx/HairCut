import { useEffect, useState } from "react";

interface AdminStats {
  totalClients: number;
  totalAppointments: number;
  upcomingCount: number;
  completedCount: number;
  totalRevenue: number;
  repeatRate: number;
  topService: string;
  galleryCount: number;
  usersNeedingReminderCount: number;
  timestamp: number;
}

export function useRealtimeStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let isCancelled = false;

    const connect = () => {
      if (isCancelled) return;
      try {
        eventSource = new EventSource("/api/realtime/admin-stats");

        eventSource.onmessage = (event) => {
          if (isCancelled) return;
          try {
            const data = JSON.parse(event.data);
            setStats(data);
            setIsConnected(true);
            setError(null);
          } catch (err) {
            console.error("Error parsing SSE data:", err);
            setError("Failed to parse data");
          }
        };

        eventSource.onerror = (err) => {
          if (isCancelled) return;
          console.error("SSE connection error:", err);
          setIsConnected(false);
          setError("Connection lost. Reconnecting...");

          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }

          // Reconnect after 5 seconds if not unmounted
          reconnectTimeout = setTimeout(() => {
            if (!isCancelled) {
              connect();
            }
          }, 5000);
        };
      } catch (err) {
        if (isCancelled) return;
        console.error("Error creating EventSource:", err);
        setError("Failed to connect to real-time updates");
      }
    };

    connect();

    return () => {
      isCancelled = true;
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return { stats, isConnected, error };
}

