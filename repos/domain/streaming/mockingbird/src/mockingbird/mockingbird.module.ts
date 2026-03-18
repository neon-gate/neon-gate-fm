import { Module } from '@nestjs/common'

import { TranscodeTrackUseCase } from '@application/use-cases'
import { MockingbirdEventBusPort, StoragePort, TranscoderPort } from '@domain/ports'

import { mockingbirdEventBusProvider } from '@infra/event-bus'
import { NatsModule } from '@infra/nats/nats.module'
import { MinioStorageAdapter } from '@infra/storage/minio-storage.adapter'
import { FfmpegTranscoderAdapter } from '@infra/transcoder/ffmpeg-transcoder.adapter'
import { TrackApprovedConsumer } from '@interface/consumers/track-approved.consumer'
import { HealthController } from '@interface/http/health.controller'

@Module({
  imports: [NatsModule],
  controllers: [HealthController],
  providers: [
    TranscodeTrackUseCase,
    TrackApprovedConsumer,
    mockingbirdEventBusProvider,
    {
      provide: StoragePort,
      useClass: MinioStorageAdapter
    },
    {
      provide: TranscoderPort,
      useClass: FfmpegTranscoderAdapter
    }
  ]
})
export class MockingbirdModule {}
