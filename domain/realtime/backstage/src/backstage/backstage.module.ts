import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import {
  GetTrackPipelineUseCase,
  ListActivePipelinesUseCase,
  ListAllPipelinesUseCase,
  ListFailedPipelinesUseCase,
  RecordPipelineEventUseCase
} from '@application/use-cases'
import { PipelineRepositoryPort } from '@domain/repositories'
import {
  natsConnectionProvider,
  NatsLifecycleService
} from '@infra/event-bus'
import {
  MongoPipelineAdapter,
  TrackPipelineDocument,
  TrackPipelineSchemaDefinition
} from '@infra/persistence'
import { HealthController, PipelinesController } from '@interface/http'
import { PipelineEventConsumer } from '@interface/event-handlers/pipeline-event.consumer'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TrackPipelineDocument.name,
        schema: TrackPipelineSchemaDefinition
      }
    ])
  ],
  controllers: [HealthController, PipelinesController],
  providers: [
    RecordPipelineEventUseCase,
    GetTrackPipelineUseCase,
    ListActivePipelinesUseCase,
    ListFailedPipelinesUseCase,
    ListAllPipelinesUseCase,
    PipelineEventConsumer,
    natsConnectionProvider,
    NatsLifecycleService,
    {
      provide: PipelineRepositoryPort,
      useClass: MongoPipelineAdapter
    }
  ]
})
export class BackstageModule {}
