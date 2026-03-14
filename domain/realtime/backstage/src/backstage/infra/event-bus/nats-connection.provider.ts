import type { Provider } from '@nestjs/common'
import { connect, type NatsConnection } from 'nats'

import { EventBusConfigFlag } from './event-bus-config-flag.enum'

export const NatsConnectionToken = Symbol('NATS_CONNECTION')

export const natsConnectionProvider: Provider = {
  provide: NatsConnectionToken,
  useFactory: async (): Promise<NatsConnection | null> => {
    const servers = process.env[EventBusConfigFlag.NatsUrl]

    if (!servers) {
      console.log('[Backstage] NATS_URL not set, event ingestion disabled')
      return null
    }

    try {
      const nc = await connect({ servers })
      console.log('[Backstage] Connected to NATS')
      return nc
    } catch (error) {
      console.warn(
        '[Backstage] Failed to connect to NATS, event ingestion disabled:',
        error instanceof Error ? error.message : String(error)
      )
      return null
    }
  }
}
