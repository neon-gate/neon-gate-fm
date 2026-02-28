import { Entity, UniqueEntityId } from '@repo/kernel'

export type PlayerSessionProps = {
  trackId: string
  positionMs: number
  status: 'playing' | 'paused'
}

export class PlayerSession extends Entity<PlayerSessionProps> {
  private constructor(props: PlayerSessionProps, id?: UniqueEntityId) {
    super(props, id)
  }

  static create(props: PlayerSessionProps, id?: UniqueEntityId): PlayerSession {
    return new PlayerSession(props, id)
  }

  get sessionId(): string {
    return this._id.toString()
  }

  get trackId(): string {
    return this.props.trackId
  }

  get positionMs(): number {
    return this.props.positionMs
  }

  get status(): 'playing' | 'paused' {
    return this.props.status
  }
}
