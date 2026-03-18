import type { EventHandler } from './event-handler'
import type { EventMap } from './event-map'

export abstract class EventBus<Events extends EventMap = EventMap> {
  abstract emit<EventName extends keyof Events>(
    event: EventName,
    payload: Events[EventName]
  ): Promise<void>

  abstract on<EventName extends keyof Events>(
    event: EventName,
    handler: EventHandler<Events[EventName]>
  ): () => void
}
