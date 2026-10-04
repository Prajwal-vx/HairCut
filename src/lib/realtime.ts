// Real-time event system using Server-Sent Events (SSE)

type EventType = 
  | "appointment_created"
  | "appointment_updated"
  | "appointment_cancelled"
  | "appointment_completed"
  | "user_registered"
  | "notification_created"
  | "stats_updated";

interface RealtimeEvent<T = unknown> {
  type: EventType;
  data: T;
  timestamp: number;
  userId?: string; // Target specific user (optional)
}

class EventEmitter {
  private listeners: Map<EventType, Set<(data: RealtimeEvent) => void>> = new Map();

  on(event: EventType, callback: (data: RealtimeEvent) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: EventType, callback: (data: RealtimeEvent) => void) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  emit(event: EventType, data: RealtimeEvent) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }
}

// Global event emitter
export const eventEmitter = new EventEmitter();

// Helper function to emit events
export function emitEvent(type: EventType, data: unknown, userId?: string) {
  const event: RealtimeEvent = {
    type,
    data,
    timestamp: Date.now(),
    userId,
  };
  eventEmitter.emit(type, event);
}

// Keep track of active SSE connections
export const activeConnections = new Map<string, ReadableStreamDefaultController>();

