import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { requireStringEnv } from '@pack/environment'

import { DbConfigFlag } from '@infra/db'

/** Provides the MongoDB connection owned by Slim Shady. */
@Module({
  imports: [
    MongooseModule.forRoot(requireStringEnv(DbConfigFlag.MongoUri), {
      dbName: requireStringEnv(DbConfigFlag.MongoDbName)
    })
  ],
  exports: [MongooseModule]
})
export class MongodbModule {}
