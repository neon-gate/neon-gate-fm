import { Injectable } from '@nestjs/common'

import { StreamPort } from '@domain/ports'

@Injectable()
export class NoopStreamAdapter implements StreamPort {
  async start(trackId: string): Promise<void> {
    // TODO: call streaming provider to start playback.
    void trackId
  }

  async pause(sessionId: string): Promise<void> {
    // TODO: call streaming provider to pause playback.
    void sessionId
  }

  async resume(sessionId: string): Promise<void> {
    // TODO: call streaming provider to resume playback.
    void sessionId
  }
}
