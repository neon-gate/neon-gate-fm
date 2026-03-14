import { Injectable } from '@nestjs/common'
import { spawn } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'

import { TranscoderPort } from '@domain/ports'

@Injectable()
export class FfmpegTranscoderAdapter implements TranscoderPort {
  async transcode(inputFile: string, bitrate: number): Promise<string> {
    const ext = path.extname(inputFile) || '.mp3'
    const outputFile = path.join(
      '/tmp',
      `mockingbird-${Date.now()}-${bitrate}${ext}`
    )

    await new Promise<void>((resolve, reject) => {
      const proc = spawn('ffmpeg', [
        '-y',
        '-i',
        inputFile,
        '-b:a',
        `${bitrate}k`,
        outputFile
      ])

      let stderr = ''
      proc.stderr?.on('data', (chunk) => {
        stderr += chunk.toString()
      })

      proc.on('close', (code) => {
        if (code === 0 && fs.existsSync(outputFile)) {
          resolve()
        } else {
          reject(new Error(`FFmpeg exited ${code}: ${stderr.slice(-500)}`))
        }
      })

      proc.on('error', reject)
    })

    return outputFile
  }
}
