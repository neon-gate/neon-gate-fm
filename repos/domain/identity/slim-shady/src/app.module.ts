import { Module } from '@nestjs/common'

import { MongodbModule } from '@infra/persistence/mongodb.module'

import { SlimShadyModule } from './slim-shady/slim-shady.module'

@Module({
  imports: [MongodbModule, SlimShadyModule]
})
export class AppModule {}
