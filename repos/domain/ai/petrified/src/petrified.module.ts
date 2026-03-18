import { Global, Module } from '@nestjs/common'

import { NatsModule, RedisModule, MinioModule } from '@env/core'
import { PetrifiedModule } from './modules/petrified/petrified.module'
import { HealthController } from './interface/http/health.controller'

@Global()
@Module({
  imports: [NatsModule, RedisModule, MinioModule, PetrifiedModule],
  exports: [NatsModule, RedisModule, MinioModule],
  controllers: [HealthController]
})
export class AppModule {}
