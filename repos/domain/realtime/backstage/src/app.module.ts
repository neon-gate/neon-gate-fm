import { Module } from '@nestjs/common'
import { MongodbModule } from './backstage/infra/persistence/mongodb.module'

import { BackstageModule } from './backstage/backstage.module'

@Module({
  imports: [MongodbModule, BackstageModule]
})
export class AppModule {}
