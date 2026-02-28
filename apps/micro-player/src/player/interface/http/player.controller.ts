import {
  PausePlaybackUseCase,
  StartPlaybackUseCase
} from '@application/use-cases'
import { Body, Controller, Patch, Post } from '@nestjs/common'

class StartPlaybackDto {
  sessionId!: string
  trackId!: string
}

class PausePlaybackDto {
  sessionId!: string
  positionMs!: number
}

@Controller('player')
export class PlayerController {
  constructor(
    private readonly startPlayback: StartPlaybackUseCase,
    private readonly pausePlayback: PausePlaybackUseCase
  ) {}

  @Post('start')
  async start(@Body() input: StartPlaybackDto): Promise<{ ok: true }> {
    await this.startPlayback.execute(input)
    return { ok: true }
  }

  @Patch('pause')
  async pause(@Body() input: PausePlaybackDto): Promise<{ ok: true }> {
    await this.pausePlayback.execute(input)
    return { ok: true }
  }
}
