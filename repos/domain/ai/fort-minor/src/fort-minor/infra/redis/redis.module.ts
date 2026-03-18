import { Module } from '@nestjs/common'
import Redis from 'ioredis'
import { requireStringEnv } from '@pack/environment'

/** Injection token for the Fort Minor Redis client. */
export const REDIS_CLIENT = 'REDIS_CLIENT'

/** Provides the Redis client owned by Fort Minor. */
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => new Redis(requireStringEnv('REDIS_URL'))
    }
  ],
  exports: [REDIS_CLIENT]
})
export class RedisModule {}
