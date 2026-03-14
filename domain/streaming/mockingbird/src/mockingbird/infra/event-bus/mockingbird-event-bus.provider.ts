import type { Provider } from '@nestjs/common'
import type { NatsConnection } from 'nats'
import { NatsEventBusAdapter } from '@repo/event-bus'

import { MockingbirdEventBusPort } from '@domain/ports'
import type { MockingbirdEventMap } from '@domain/events'

import { NoopEventBusAdapter } from './noop-event-bus.adapter'
import { NatsConnectionToken } from './nats-connection.provider'

export const mockingbirdEventBusProvider: Provider = {
  provide: MockingbirdEventBusPort,
  useFactory: (connection: NatsConnection | null) => {
    if (!connection) {
      return new NoopEventBusAdapter<MockingbirdEventMap>()
    }

    return new NatsEventBusAdapter<MockingbirdEventMap>(connection)
  },
  inject: [NatsConnectionToken]
}
