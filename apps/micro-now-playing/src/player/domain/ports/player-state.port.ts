export const PLAYER_STATE_PORT = Symbol('PLAYER_STATE_PORT')

export interface PlayerStateSnapshot {
  sessionId: string
  trackId: string
  status: 'playing' | 'paused'
  positionMs: number
}

export abstract class PlayerStatePort {
  abstract save(snapshot: PlayerStateSnapshot): Promise<void>
  abstract getBySessionId(
    sessionId: string
  ): Promise<PlayerStateSnapshot | null>
}
