import type { EventBus } from './event-bus.abstract'
import { EventBus as EventBusBase } from './event-bus.abstract'
import type { EventMap } from './event-map'

export function createEventBus<Events extends EventMap>(): EventBus<Events> {
  return new (class extends EventBusBase<Events> {
    private readonly listeners = new Map<
      keyof Events,
      Set<(payload: Events[keyof Events]) => void | Promise<void>>
    >()

    async emit<EventName extends keyof Events>(
      event: EventName,
      payload: Events[EventName]
    ): Promise<void> {
      const handlers = this.listeners.get(event)
      if (!handlers) return

      for (const handler of handlers) {
        await handler(payload)
      }
    }

    on<EventName extends keyof Events>(
      event: EventName,
      handler: (payload: Events[EventName]) => void | Promise<void>
    ): () => void {
      let handlers = this.listeners.get(event)
      if (!handlers) {
        handlers = new Set()
        this.listeners.set(event, handlers)
      }
      handlers.add(handler as (payload: Events[keyof Events]) => void | Promise<void>)

      return () => {
        this.listeners
          .get(event)
          ?.delete(handler as (payload: Events[keyof Events]) => void | Promise<void>)
      }
    }
  })()
}
