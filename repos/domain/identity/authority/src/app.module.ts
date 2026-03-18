import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { MongodbModule } from '@infra/persistence/mongodb.module'

import { AuthorityModule } from './authority/authority.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongodbModule,
    AuthorityModule
  ]
})
export class AppModule {}
