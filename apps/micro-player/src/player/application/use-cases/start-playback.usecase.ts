import { Inject, Injectable } from '@nestjs/common'

import {
  PLAYER_STATE_PORT,
  PlayerStatePort,
  STREAM_PORT,
  StreamPort
} from '@domain/ports'

export type StartPlaybackInput = {
  sessionId: string
  trackId: string
}

@Injectable()
export class StartPlaybackUseCase {
  constructor(
    @Inject(STREAM_PORT)
    private readonly stream: StreamPort,
    @Inject(PLAYER_STATE_PORT)
    private readonly state: PlayerStatePort
  ) {}

  async execute(input: StartPlaybackInput): Promise<void> {
    // TODO: orchestrate stream start and persist initial player state.
    void input
    void this.stream
    void this.state
  }
}
