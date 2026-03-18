import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { UploadTrackUseCase } from '@application/use-cases'
import {
  FileStoragePort,
  FileValidatorPort,
  ObjectStoragePort
} from '@domain/ports'

import { trackEventBusProvider } from '@infra/event-bus'
import { FileStorageAdapter } from '@infra/file-storage.adapter'
import { FileValidatorAdapter } from '@infra/file-validator.adapter'
import { NatsModule } from '@infra/nats/nats.module'
import { MinioStorageAdapter } from '@infra/object-storage/minio-storage.adapter'
import { uploadConfigProviders } from '@infra/upload-config.provider'
import { UploadCleanupService } from '@infra/cleanup/upload-cleanup.service'
import { UploadController } from '@interface/http'

@Module({
  imports: [ScheduleModule.forRoot(), NatsModule],
  controllers: [UploadController],
  providers: [
    UploadTrackUseCase,
    ...uploadConfigProviders,
    trackEventBusProvider,
    UploadCleanupService,
    {
      provide: FileValidatorPort,
      useClass: FileValidatorAdapter
    },
    {
      provide: FileStoragePort,
      useClass: FileStorageAdapter
    },
    {
      provide: ObjectStoragePort,
      useClass: MinioStorageAdapter
    }
  ]
})
export class SoundgardenModule {}
