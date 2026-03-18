import type { EventPrimitive } from '@pack/kernel'
import type { NatsConnection } from 'nats'

import { NatsConsumer } from '../nats/nats-consumer.adapter'
import { NatsPublisher } from '../nats/nats-publisher.adapter'
import type { EventContract } from '../types/event-contract.type'
import { EventBus } from '../ports/event-bus.port'

function isEventEnvelope<T extends Record<string, unknown>>(
  payload: T | EventPrimitive<T>
): payload is EventPrimitive<T> {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'eventId' in payload &&
    'aggregateId' in payload &&
    'occurredOn' in payload &&
    'eventVersion' in payload &&
    'payload' in payload
  )
}

function inferAggregateId(payload: Record<string, unknown>, fallback: string): string {
  const candidateKeys = [
    'aggregateId',
    'trackId',
    'userId',
    'profileId',
    'sessionId',
    'id'
  ] as const

  for (const key of candidateKeys) {
    const value = payload[key]
    if (typeof value === 'string' && value.length > 0) return value
  }

  return fallback
}

function toEnvelope<EventName extends string, Payload extends Record<string, unknown>>(
  event: EventName,
  payload: Payload | EventPrimitive<Payload>
): EventPrimitive<Payload> {
  if (isEventEnvelope(payload)) return payload

  const eventId = `evt_${Date.now()}_${Math.random().toString(16).slice(2)}`
  return {
    eventId,
    eventName: event,
    eventVersion: 1,
    aggregateId: inferAggregateId(payload, eventId),
    occurredOn: new Date(),
    payload
  }
}

/**
 * Backward-compatible adapter preserving the legacy `emit`/`on` API.
 *
 * Prefer `NatsPublisher` and `NatsConsumer` directly for new code.
 */
export class NatsEventBusAdapter<Events extends EventContract>
  extends EventBus<Events>
{
  private readonly publisher: NatsPublisher<Events>
  private readonly consumer: NatsConsumer<Events>

  constructor(
    connection: NatsConnection,
    queue = 'default-workers'
  ) {
    super()
    this.publisher = new NatsPublisher<Events>(connection)
    this.consumer = new NatsConsumer<Events>(connection, queue)
  }

  /**
   * Emits an envelope to the NATS subject.
   */
  async emit<EventName extends keyof Events & string>(
    event: EventName,
    payload: Events[EventName] | EventPrimitive<Events[EventName]>
  ): Promise<void> {
    await this.publisher.publish(event, toEnvelope(event, payload))
  }

  /**
   * Registers an envelope handler for the subject.
   */
  on<EventName extends keyof Events & string>(
    event: EventName,
    handler: (payload: EventPrimitive<Events[EventName]>) => void | Promise<void>
  ): () => void {
    return this.consumer.subscribe(event, handler)
  }
}
