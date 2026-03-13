import { Injectable } from '@nestjs/common'

import {
  FileValidatorPort,
  type ValidationFailure,
  type ValidationResult
} from '@domain/ports'

const ALLOWED_MIME_TYPES = ['audio/mpeg', 'audio/wav'] as const
const ALLOWED_EXTENSIONS = ['.mp3', '.wav'] as const

@Injectable()
export class FileValidatorAdapter extends FileValidatorPort {
  async validate(
    file: Express.Multer.File,
    maxSizeBytes: number
  ): Promise<ValidationResult | ValidationFailure> {
    if (!file || !file.buffer) {
      return {
        success: false,
        errorCode: 'UPLOAD_INTERRUPTED',
        message: 'File is missing or upload was interrupted'
      }
    }

    const fileSize = file.size ?? file.buffer?.length ?? 0

    if (fileSize > maxSizeBytes) {
      return {
        success: false,
        errorCode: 'FILE_TOO_LARGE',
        message: 'File exceeds maximum allowed size'
      }
    }

    const mimeType = file.mimetype ?? ''
    const ext = this.getExtension(file.originalname ?? '')

    const mimeOk = ALLOWED_MIME_TYPES.includes(
      mimeType as (typeof ALLOWED_MIME_TYPES)[number]
    )
    const extOk = ALLOWED_EXTENSIONS.includes(
      ext as (typeof ALLOWED_EXTENSIONS)[number]
    )

    if (!mimeOk || !extOk) {
      return {
        success: false,
        errorCode: 'UNSUPPORTED_FORMAT',
        message: 'File format is not supported. Use .mp3 or .wav'
      }
    }

    return {
      success: true,
      mimeType,
      fileSize
    }
  }

  private getExtension(filename: string): string {
    const i = filename.lastIndexOf('.')
    return i >= 0 ? filename.slice(i).toLowerCase() : ''
  }
}
