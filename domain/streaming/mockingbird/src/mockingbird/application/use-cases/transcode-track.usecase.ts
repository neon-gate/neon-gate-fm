import { Injectable } from '@nestjs/common'
import { UseCase } from '@repo/kernel'
import * as fs from 'fs'

import {
  MockingbirdEventBusPort,
  StoragePort,
  TranscoderPort
} from '@domain/ports'

@Injectable()
export class TranscodeTrackUseCase extends UseCase<[trackId: string, objectKey: string], void> {
  constructor(
    private readonly storage: StoragePort,
    private readonly transcoder: TranscoderPort,
    private readonly eventBus: MockingbirdEventBusPort
  ) {
    super()
  }

  async execute(
    trackId: string,
    objectKey: string
  ): Promise<void> {
    let original: string | null = null

    try {
      await this.eventBus.emit('track.transcoding.started', { trackId })

      original = await this.storage.download(objectKey)

      const [file128, file320] = await Promise.all([
        this.transcoder.transcode(original, 128),
        this.transcoder.transcode(original, 320)
      ])

      const key128 = `transcoded/${trackId}/128.mp3`
      const key320 = `transcoded/${trackId}/320.mp3`

      await this.storage.upload(key128, file128)
      await this.storage.upload(key320, file320)

      await this.eventBus.emit('track.transcoding.completed', {
        trackId,
        variants: [key128, key320]
      })
    } catch (error) {
      await this.eventBus.emit('track.transcoding.failed', {
        trackId,
        errorCode: 'TRANSCODING_FAILED',
        message: error instanceof Error ? error.message : String(error)
      })
      throw error
    } finally {
      if (original && fs.existsSync(original)) {
        try {
          fs.unlinkSync(original)
        } catch {
          // ignore cleanup errors
        }
      }
    }
  }
}
