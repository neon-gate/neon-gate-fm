export const STREAM_PORT = Symbol('STREAM_PORT')

export abstract class StreamPort {
  abstract start(trackId: string): Promise<void>
  abstract pause(sessionId: string): Promise<void>
  abstract resume(sessionId: string): Promise<void>
}
