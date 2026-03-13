import { Module } from '@nestjs/common'

import { UploadTrackUseCase } from '@application/use-cases'
import { FileStoragePort, FileValidatorPort } from '@domain/ports'
import {
  natsConnectionProvider,
  NatsLifecycleService,
  trackEventBusProvider
} from '@infra/event-bus'
import { FileStorageAdapter } from '@infra/file-storage.adapter'
import { FileValidatorAdapter } from '@infra/file-validator.adapter'
import { uploadConfigProviders } from '@infra/upload-config.provider'
import { UploadController } from '@interface/http'

@Module({
  controllers: [UploadController],
  providers: [
    UploadTrackUseCase,
    ...uploadConfigProviders,
    natsConnectionProvider,
    trackEventBusProvider,
    NatsLifecycleService,
    {
      provide: FileValidatorPort,
      useClass: FileValidatorAdapter
    },
    {
      provide: FileStoragePort,
      useClass: FileStorageAdapter
    }
  ]
})
export class SoundgardenModule {}
