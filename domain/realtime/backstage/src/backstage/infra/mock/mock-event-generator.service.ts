import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import type { NatsConnection } from 'nats'
import { BroadcastPipelineEventUseCase } from '../../application/use-cases/broadcast-pipeline-event.use-case'
import { NatsConnectionToken } from '../event-bus/nats-connection.provider'

const MOCK_EVENT_SEQUENCE = [
  'track.upload.received',
  'track.upload.validated',
  'track.upload.stored',
  'track.uploaded',
  'track.petrified.generated',
  'track.fort-minor.started',
  'track.fort-minor.completed',
  'track.approved',
  'track.transcoding.started',
  'track.transcoding.completed',
  'track.ready'
]

const MOCK_DELAY_MS = 1200

@Injectable()
export class MockEventGeneratorService implements OnModuleInit {
  constructor(
    private readonly broadcastUseCase: BroadcastPipelineEventUseCase,
    @Inject(NatsConnectionToken) private readonly nc: NatsConnection | null
  ) {}

  onModuleInit(): void {
    const mockMode = process.env.MOCK_MODE === 'true'
    if (this.nc && !mockMode) {
      console.log('[Backstage] NATS connected, skipping mock event generator')
      return
    }

    void this.runMockSequence()
  }

  private async runMockSequence(): Promise<void> {
    const trackId = crypto.randomUUID()

    for (const eventType of MOCK_EVENT_SEQUENCE) {
      await new Promise((r) => setTimeout(r, MOCK_DELAY_MS))

      await this.broadcastUseCase.execute({
        trackId,
        eventType,
        payload: {}
      })

      console.log('[Backstage] Mock event:', eventType, trackId)
    }
  }
}
