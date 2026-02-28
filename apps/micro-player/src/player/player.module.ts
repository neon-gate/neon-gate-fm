import { Module } from '@nestjs/common'

import {
  PausePlaybackUseCase,
  StartPlaybackUseCase
} from '@application/use-cases'
import { PLAYER_STATE_PORT, STREAM_PORT } from '@domain/ports'
import { EnvService } from '@infra/env'
import { InMemoryPlayerStateAdapter } from '@infra/state'
import { NoopStreamAdapter } from '@infra/stream'
import { PlayerController } from '@interface/http'

@Module({
  controllers: [PlayerController],
  providers: [
    EnvService,
    StartPlaybackUseCase,
    PausePlaybackUseCase,
    { provide: STREAM_PORT, useClass: NoopStreamAdapter },
    { provide: PLAYER_STATE_PORT, useClass: InMemoryPlayerStateAdapter }
  ]
})
export class PlayerModule {}
