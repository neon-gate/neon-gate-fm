import { Global, Module } from '@nestjs/common'

import { NatsModule, MongodbModule } from '@env/core'
import { StereoModule } from './stereo/stereo.module'
import { HealthController } from './stereo/interface/http/health.controller'

@Global()
@Module({
  imports: [NatsModule, MongodbModule, StereoModule],
  exports: [NatsModule, MongodbModule],
  controllers: [HealthController]
})
export class AppModule {}
