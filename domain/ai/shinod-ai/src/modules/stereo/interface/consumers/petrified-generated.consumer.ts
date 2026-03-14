import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { NatsQueueConsumerAdapter } from '@repo/event-bus'
import type { NatsConnection } from 'nats'

import { NatsConnectionToken } from '@core/infra/nats/nats-connection.provider'
import { optionalStringEnv } from '@core/infra/env/optional-env'
import { AggregateFingerprintSignalUseCase } from '@stereo/application/use-cases/aggregate-fingerprint-signal.use-case'
import { RunStereoUseCase } from '@stereo/application/use-cases/run-stereo.use-case'
import type { StereoInboundEventMap } from '@stereo/domain/events/stereo-event.map'

/// Subscribes to `track.petrified.generated`, stores the fingerprint signal,
/// and checks if stereo can now start.
@Injectable()
export class PetrifiedGeneratedConsumer implements OnApplicationBootstrap {
  constructor(
    @Inject(NatsConnectionToken)
    private readonly connection: NatsConnection | null,
    private readonly aggregateFingerprint: AggregateFingerprintSignalUseCase,
    private readonly runStereo: RunStereoUseCase
  ) {}

  onApplicationBootstrap(): void {
    if (!this.connection) return

    const queue = optionalStringEnv('NATS_QUEUE_GROUP', 'shinod-ai-workers')
    const consumer = new NatsQueueConsumerAdapter<StereoInboundEventMap>(
      this.connection,
      queue
    )

    consumer.subscribe('track.petrified.generated', async (payload) => {
      await this.aggregateFingerprint.execute({
        trackId: payload.trackId,
        fingerprintHash: payload.fingerprintHash,
        audioHash: payload.audioHash
      })

      await this.runStereo.execute({
        eventId: `stereo:petrified:${payload.trackId}`,
        trackId: payload.trackId
      })
    })
  }
}
