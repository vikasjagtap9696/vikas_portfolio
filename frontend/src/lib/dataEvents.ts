// Simple event emitter for cross-component data synchronization
type EventCallback = () => void;

class DataEventEmitter {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  subscribe(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  emit(event: string): void {
    this.listeners.get(event)?.forEach(callback => callback());
  }
}

export const dataEvents = new DataEventEmitter();

// Event names
export const DATA_EVENTS = {
  PROJECTS_UPDATED: 'projects_updated',
  CERTIFICATES_UPDATED: 'certificates_updated',
} as const;
