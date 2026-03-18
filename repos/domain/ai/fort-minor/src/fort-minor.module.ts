import { Global, Module } from '@nestjs/common'

import { NatsModule, RedisModule, MinioModule } from '@env/core'
import { FortMinorModule } from './modules/fort-minor/fort-minor.module'
import { HealthController } from './interface/http/health.controller'

@Global()
@Module({
  imports: [NatsModule, RedisModule, MinioModule, FortMinorModule],
  exports: [NatsModule, RedisModule, MinioModule],
  controllers: [HealthController]
})
export class AppModule {}
