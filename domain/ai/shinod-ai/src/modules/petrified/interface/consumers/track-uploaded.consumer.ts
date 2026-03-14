import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { NatsQueueConsumerAdapter } from '@repo/event-bus'
import type { NatsConnection } from 'nats'

import { NatsConnectionToken } from '@core/infra/nats/nats-connection.provider'
import { optionalStringEnv } from '@core/infra/env/optional-env'
import { GenerateFingerprintUseCase } from '@petrified/application/use-cases/generate-fingerprint.use-case'
import type { TrackUploadedEventMap } from '@petrified/domain/events/petrified-event.map'

/// Subscribes to `track.uploaded` and delegates to GenerateFingerprintUseCase.
@Injectable()
export class TrackUploadedConsumer implements OnApplicationBootstrap {
  private consumer: NatsQueueConsumerAdapter<TrackUploadedEventMap> | null =
    null

  constructor(
    @Inject(NatsConnectionToken)
    private readonly connection: NatsConnection | null,
    private readonly generateFingerprint: GenerateFingerprintUseCase
  ) {}

  onApplicationBootstrap(): void {
    if (!this.connection) return

    const queue = optionalStringEnv('NATS_QUEUE_GROUP', 'shinod-ai-workers')
    this.consumer = new NatsQueueConsumerAdapter<TrackUploadedEventMap>(
      this.connection,
      queue
    )

    this.consumer.subscribe('track.uploaded', async (payload) => {
      const petrifiedStorage =
        payload.petrifiedStorage ?? payload.storage
      const fortMinorStorage =
        payload.fortMinorStorage ?? payload.transcriptionStorage
      if (!petrifiedStorage || !fortMinorStorage) return

      await this.generateFingerprint.execute({
        eventId: `track.uploaded:${payload.trackId}`,
        trackId: payload.trackId,
        storage: petrifiedStorage,
        fortMinorStorage
      })
    })
  }
}
