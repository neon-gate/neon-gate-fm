import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { requireStringEnv } from '@pack/environment'

/** Provides the MongoDB connection owned by Stereo. */
@Module({
  imports: [
    MongooseModule.forRoot(requireStringEnv('MONGO_URI'), {
      dbName: requireStringEnv('MONGO_DB_NAME')
    })
  ],
  exports: [MongooseModule]
})
export class MongodbModule {}
