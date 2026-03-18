import { Module, type Provider } from '@nestjs/common'

import { AudioStoragePort } from '@domain/ports/audio-storage.port'

import { MinioAudioStorageAdapter } from './minio-audio-storage.adapter'

const storageProvider: Provider = {
  provide: AudioStoragePort,
  useClass: MinioAudioStorageAdapter
}

/** Provides the audio-storage port owned by Fort Minor. */
@Module({
  providers: [storageProvider],
  exports: [AudioStoragePort]
})
export class StorageModule {}
