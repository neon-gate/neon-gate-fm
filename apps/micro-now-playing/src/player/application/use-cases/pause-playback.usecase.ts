import { Inject, Injectable } from '@nestjs/common'

import {
  PLAYER_STATE_PORT,
  PlayerStatePort,
  STREAM_PORT,
  StreamPort
} from '@domain/ports'

export interface PausePlaybackInput {
  sessionId: string
  positionMs: number
}

@Injectable()
export class PausePlaybackUseCase {
  constructor(
    @Inject(STREAM_PORT)
    private readonly stream: StreamPort,
    @Inject(PLAYER_STATE_PORT)
    private readonly state: PlayerStatePort
  ) {}

  async execute(input: PausePlaybackInput): Promise<void> {
    // TODO: pause stream and persist latest playback position.
    void input
    void this.stream
    void this.state
  }
}
