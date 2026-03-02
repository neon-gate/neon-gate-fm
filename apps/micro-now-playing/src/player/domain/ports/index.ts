// ports — Interfaces (contracts) for outward communication; implemented by infra and interface layers.
export {
  PLAYER_STATE_PORT,
  PlayerStatePort,
  type PlayerStateSnapshot
} from './player-state.port'
export { STREAM_PORT, StreamPort } from './stream.port'
