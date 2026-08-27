import { ActivityEvent } from './types';

type Listener = (event: ActivityEvent) => void;

class EventBus {
  private listeners: Listener[] = [];
  private history: ActivityEvent[] = [];

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public emit(event: ActivityEvent): void {
    this.history.unshift(event);
    if (this.history.length > 50) this.history.pop();
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        console.error('[WebMCP EventBus Error]', err);
      }
    }
  }

  public getHistory(): ActivityEvent[] {
    return [...this.history];
  }

  public clear(): void {
    this.history = [];
  }
}

export const eventBus = new EventBus();

