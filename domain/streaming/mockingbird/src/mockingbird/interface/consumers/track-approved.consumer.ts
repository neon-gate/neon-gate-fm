import { Injectable, OnModuleInit } from '@nestjs/common'

import { MockingbirdEventBusPort } from '@domain/ports'
import { TranscodeTrackUseCase } from '@application/use-cases'

@Injectable()
export class TrackApprovedConsumer implements OnModuleInit {
  private unsubscribe: (() => void) | null = null

  constructor(
    private readonly eventBus: MockingbirdEventBusPort,
    private readonly transcodeTrack: TranscodeTrackUseCase
  ) {}

  onModuleInit(): void {
    this.unsubscribe = this.eventBus.on(
      'track.approved',
      async (payload: {
        trackId: string
        objectKey?: string
        storage?: { bucket: string; key: string }
      }) => {
        const trackId = payload.trackId
        const objectKey =
          payload.objectKey ??
          (payload.storage
            ? `${payload.storage.bucket}/${payload.storage.key}`
            : null)

        if (!objectKey) {
          console.error('[Mockingbird] track.approved missing objectKey or storage', payload)
          return
        }

        console.log('[Mockingbird] Processing track.approved', { trackId, objectKey })

        try {
          await this.transcodeTrack.execute(trackId, objectKey)
        } catch (error) {
          console.error('[Mockingbird] Transcode failed', { trackId, error })
        }
      }
    )

    console.log('[Mockingbird] Subscribed to track.approved')
  }
}
