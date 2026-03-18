import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import {
  CompleteOnboardingUseCase,
  CreateUserProfileUseCase,
  GetUserProfileUseCase,
  GetUserProfileByAuthIdUseCase,
  UpdateUserPreferencesUseCase,
  UpdateUserProfileUseCase
} from '@application/use-cases'
import { UserPort } from '@domain/ports'
import {
  MongooseUserAdapter,
  UserSchemaDefinition,
  UserSchemaName
} from '@infra/mongoose'
import { NatsModule } from '@infra/nats/nats.module'
import { slimShadyEventBusProvider } from '@infra/event-bus'
import { UserSignedUpConsumer } from '@interface/consumers/user-signed-up.consumer'
import { HealthController, UserProfileController } from '@interface/http'

@Module({
  imports: [
    NatsModule,
    MongooseModule.forFeature([
      { name: UserSchemaName, schema: UserSchemaDefinition }
    ])
  ],

  controllers: [HealthController, UserProfileController],

  providers: [
    CreateUserProfileUseCase,
    UpdateUserProfileUseCase,
    GetUserProfileUseCase,
    GetUserProfileByAuthIdUseCase,
    UpdateUserPreferencesUseCase,
    CompleteOnboardingUseCase,
    UserSignedUpConsumer,
    slimShadyEventBusProvider,
    {
      provide: UserPort,
      useClass: MongooseUserAdapter
    }
  ]
})
export class SlimShadyModule {}
