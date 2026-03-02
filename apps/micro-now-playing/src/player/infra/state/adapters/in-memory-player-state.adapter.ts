import { Injectable } from '@nestjs/common'

import { type PlayerStateSnapshot, PlayerStatePort } from '@domain/ports'

@Injectable()
export class InMemoryPlayerStateAdapter implements PlayerStatePort {
  private readonly states = new Map<string, PlayerStateSnapshot>()

  async save(snapshot: PlayerStateSnapshot): Promise<void> {
    // TODO: replace this with Redis or another persistence adapter.
    this.states.set(snapshot.sessionId, snapshot)
  }

  async getBySessionId(sessionId: string): Promise<PlayerStateSnapshot | null> {
    // TODO: replace this with Redis or another persistence adapter.
    return this.states.get(sessionId) ?? null
  }
}
