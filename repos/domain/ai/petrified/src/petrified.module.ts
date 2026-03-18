import { Global, Module } from '@nestjs/common'

import { NatsModule, RedisModule, MinioModule } from '@env/core'
import { PetrifiedModule } from './petrified/petrified.module'
import { HealthController } from './petrified/interface/http/health.controller'

@Global()
@Module({
  imports: [NatsModule, RedisModule, MinioModule, PetrifiedModule],
  exports: [NatsModule, RedisModule, MinioModule],
  controllers: [HealthController]
})
export class AppModule {}
