import { Inject, Injectable } from '@nestjs/common'
import { uuidv7 } from 'uuidv7'

import { UseCase } from '@repo/kernel'

import {
  FileStoragePort,
  FileValidatorPort,
  TrackEventBusPort
} from '@domain/ports'
import type { ValidationFailure } from '@domain/ports'

import { UPLOAD_MAX_SIZE_BYTES, UPLOAD_STORAGE_PATH } from '@infra/upload-config.provider'

export interface UploadTrackInput {
  file: Express.Multer.File
}

export interface UploadTrackResult {
  trackId: string
  status: 'uploaded'
}

@Injectable()
export class UploadTrackUseCase extends UseCase<
  [input: UploadTrackInput],
  UploadTrackResult
> {
  constructor(
    @Inject(TrackEventBusPort)
    private readonly events: TrackEventBusPort,
    private readonly validator: FileValidatorPort,
    private readonly storage: FileStoragePort,
    @Inject(UPLOAD_MAX_SIZE_BYTES)
    private readonly maxSizeBytes: number,
    @Inject(UPLOAD_STORAGE_PATH)
    private readonly storagePath: string
  ) {
    super()
  }

  async execute(input: UploadTrackInput): Promise<UploadTrackResult> {
    const { file } = input
    const trackId = uuidv7()

    await this.events.emit('track.upload.received', {
      trackId,
      fileName: file.originalname,
      receivedAt: new Date().toISOString()
    })

    const validation = await this.validator.validate(file, this.maxSizeBytes)

    if (!validation.success) {
      const failure = validation as ValidationFailure
      await this.events.emit('track.upload.failed', {
        trackId,
        errorCode: failure.errorCode,
        message: failure.message
      })
      throw new UploadValidationError(failure.errorCode, failure.message)
    }

    await this.events.emit('track.upload.validated', {
      trackId,
      fileName: file.originalname,
      fileSize: validation.fileSize,
      mimeType: validation.mimeType,
      validatedAt: new Date().toISOString()
    })

    let stored: { filePath: string; fileName: string; fileSize: number }
    try {
      stored = await this.storage.store(trackId, file, this.storagePath)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Storage operation failed'
      await this.events.emit('track.upload.failed', {
        trackId,
        errorCode: 'STORAGE_FAILED',
        message
      })
      throw new UploadStorageError(message)
    }

    await this.events.emit('track.upload.stored', {
      trackId,
      filePath: stored.filePath,
      fileName: stored.fileName,
      fileSize: stored.fileSize,
      storedAt: new Date().toISOString()
    })

    await this.events.emit('track.uploaded', {
      trackId,
      filePath: stored.filePath,
      fileName: stored.fileName,
      fileSize: stored.fileSize,
      uploadedAt: new Date().toISOString()
    })

    return { trackId, status: 'uploaded' }
  }
}

export class UploadValidationError extends Error {
  constructor(
    public readonly errorCode: string,
    message: string
  ) {
    super(message)
    this.name = 'UploadValidationError'
  }
}

export class UploadStorageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UploadStorageError'
  }
}
