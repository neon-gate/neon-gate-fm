import { Global, Module } from '@nestjs/common'

import { NatsModule } from '@infra/nats/nats.module'
import { MongodbModule } from '@infra/persistence/mongodb.module'
import { StereoModule } from './stereo/stereo.module'
import { HealthController } from './stereo/interface/http/health.controller'

@Global()
@Module({
  imports: [NatsModule, MongodbModule, StereoModule],
  exports: [NatsModule, MongodbModule],
  controllers: [HealthController]
})
export class AppModule {}
