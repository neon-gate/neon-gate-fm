## Constraints

- **NEVER modify `@pack/kernel`** -- use its abstractions, don't change them
- **No shared infra between micros** -- each micro owns its own Mongo/Redis/MinIO
- **NATS stays shared** -- single event plane for the entire platform
- **Don't break `pnpm infra`** -- docker scripts must work end-to-end after refactoring
- **Follow GENERAL_CODE_GUIDELINE.md and BACKEND_CODE_GUIDELINE.md** throughout
- **Domain service migration is a separate task** -- this plan covers package/infra/orchestration only
- **Each phase must leave the workspace in a buildable state** -- no intermediate breakage

## Phase 2 -- Internalize Infrastructure Per Microservice

### 2.1 Per-Micro Infra Requirements

Each microservice creates local infra wiring in its `src/<service>/infra/` layer. No micro imports infra modules from another package.

| Micro | Needs Mongo | Needs Redis | Needs MinIO/S3 | Needs NATS | Needs AudioStoragePort | Files to Create |
|-------|-------------|-------------|----------------|------------|------------------------|-----------------|
| authority | Yes | No | No | Yes | No | `infra/persistence/mongodb.module.ts`, `infra/nats/nats.module.ts` |
| slim-shady | Yes | No | No | Yes | No | `infra/persistence/mongodb.module.ts`, `infra/nats/nats.module.ts` |
| soundgarden | No | No | Yes (already has local adapter) | Yes | No | `infra/nats/nats.module.ts` |
| backstage | Yes | No | No | Yes | No | `infra/persistence/mongodb.module.ts`, `infra/nats/nats.module.ts` |
| petrified | No | Yes | Yes | Yes | Yes | `infra/redis/redis.module.ts`, `infra/storage/storage.module.ts`, `infra/nats/nats.module.ts`, `domain/ports/audio-storage.port.ts`, `infra/storage/minio-audio-storage.adapter.ts` |
| fort-minor | No | Yes | Yes | Yes | Yes | `infra/redis/redis.module.ts`, `infra/storage/storage.module.ts`, `infra/nats/nats.module.ts`, `domain/ports/audio-storage.port.ts`, `infra/storage/minio-audio-storage.adapter.ts` |
| stereo | Yes | No | No | Yes | No | `infra/persistence/mongodb.module.ts`, `infra/nats/nats.module.ts` |
| mockingbird | No | No | Yes (already has local adapter) | Yes | No | `infra/nats/nats.module.ts` |
| hybrid-storage | No | No | Yes | Yes | No | `infra/nats/nats.module.ts` |

### 2.2 Local NatsModule Pattern

Every micro creates this identical module in `src/<service>/infra/nats/nats.module.ts`:

```typescript
import { Module } from '@nestjs/common'
import {
  NatsConnectionToken,
  natsConnectionProvider,
  NatsLifecycleService
} from '@pack/nats-broker-messaging'

/** Provides a NATS connection and lifecycle drain for this microservice. */
@Module({
  providers: [natsConnectionProvider, NatsLifecycleService],
  exports: [NatsConnectionToken]
})
export class NatsModule {}
```

### 2.3 Local MongodbModule Pattern

For micros that need MongoDB (authority, slim-shady, backstage, stereo), create `src/<service>/infra/persistence/mongodb.module.ts`:

```typescript
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { requireStringEnv } from '@pack/environment'

/** Provides a MongoDB/Mongoose connection scoped to this microservice's own database. */
@Module({
  imports: [
    MongooseModule.forRoot(requireStringEnv('MONGO_URI'), {
      dbName: requireStringEnv('MONGO_DB_NAME')
    })
  ],
  exports: [MongooseModule]
})
export class MongodbModule {}
```

### 2.4 Local RedisModule Pattern

For micros that need Redis (petrified, fort-minor), create `src/<service>/infra/redis/redis.module.ts`:

```typescript
import { Module } from '@nestjs/common'
import Redis from 'ioredis'
import { requireStringEnv } from '@pack/environment'

/** Injection token for the Redis client instance. */
export const REDIS_CLIENT = 'REDIS_CLIENT'

/** Provides a Redis client connected to this microservice's own Redis instance. */
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
```

### 2.5 Migrate AudioStoragePort

Currently `AudioStoragePort` and `MinioAudioStorageAdapter` live in `repos/environment/core/src/minio/`. They are used by **petrified** and **fort-minor** only.

**Action for each of these two micros:**

1. Create `src/<service>/domain/ports/audio-storage.port.ts`:

```typescript
/** Result of downloading an audio file from object storage to a temp location. */
export interface DownloadedAudio {
  filePath: string
  cleanup: () => Promise<void>
}

/** Port for downloading audio files from object storage. */
export abstract class AudioStoragePort {
  abstract download(bucket: string, key: string): Promise<DownloadedAudio>
}
```

2. Create `src/<service>/infra/storage/minio-audio-storage.adapter.ts`:

```typescript
import { Injectable } from '@nestjs/common'
import { S3Client, GetObjectCommand, type S3ClientConfig } from '@aws-sdk/client-s3'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'
import type { Readable } from 'node:stream'
import { optionalStringEnv } from '@pack/environment'
import { AudioStoragePort, type DownloadedAudio } from '@domain/ports/audio-storage.port'

function buildS3Client(): S3Client {
  const config: S3ClientConfig = {
    region: optionalStringEnv('STORAGE_REGION', 'us-east-1'),
    credentials: {
      accessKeyId: optionalStringEnv('STORAGE_ACCESS_KEY', 'minioadmin'),
      secretAccessKey: optionalStringEnv('STORAGE_SECRET_KEY', 'minioadmin')
    },
    forcePathStyle: true,
    endpoint: optionalStringEnv('STORAGE_ENDPOINT', 'http://localhost:9000')
  }
  return new S3Client(config)
}

/** Downloads audio from MinIO/S3-compatible object storage to a temp file. */
@Injectable()
export class MinioAudioStorageAdapter extends AudioStoragePort {
  private readonly client = buildS3Client()

  async download(bucket: string, key: string): Promise<DownloadedAudio> {
    const response = await this.client.send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    )
    const fileName = path.basename(key)
    const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'audio-'))
    const filePath = path.join(tmpDir, fileName)
    const stream = response.Body as Readable
    await new Promise<void>((resolve, reject) => {
      const writer = fs.createWriteStream(filePath)
      stream.pipe(writer)
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
    return {
      filePath,
      cleanup: async () => {
        await fs.promises.rm(tmpDir, { recursive: true, force: true })
      }
    }
  }
}
```

3. Create `src/<service>/infra/storage/storage.module.ts`:

```typescript
import { Module } from '@nestjs/common'
import type { Provider } from '@nestjs/common'
import { AudioStoragePort } from '@domain/ports/audio-storage.port'
import { MinioAudioStorageAdapter } from './minio-audio-storage.adapter'

const storageProvider: Provider = {
  provide: AudioStoragePort,
  useClass: MinioAudioStorageAdapter
}

/** Provides the AudioStoragePort bound to this micro's own MinIO instance. */
@Module({
  providers: [storageProvider],
  exports: [AudioStoragePort]
})
export class StorageModule {}
```

### 2.6 Update App Modules

Each micro's `app.module.ts` (or `<service>.module.ts`) must replace `@env/core` imports with the local infra modules.

**petrified** -- `src/petrified.module.ts`:
```diff
- import { NatsModule, RedisModule, MinioModule } from '@env/core'
+ import { NatsModule } from '@infra/nats/nats.module'
+ import { RedisModule } from '@infra/redis/redis.module'
+ import { StorageModule } from '@infra/storage/storage.module'

  @Module({
-   imports: [NatsModule, RedisModule, MinioModule],
+   imports: [NatsModule, RedisModule, StorageModule],
    ...
  })
```

**fort-minor** -- `src/app.module.ts`:
```diff
- import { NatsModule, RedisModule, MinioModule } from '@env/core'
+ import { NatsModule } from '@infra/nats/nats.module'
+ import { RedisModule } from '@infra/redis/redis.module'
+ import { StorageModule } from '@infra/storage/storage.module'

  @Module({
-   imports: [NatsModule, RedisModule, MinioModule],
+   imports: [NatsModule, RedisModule, StorageModule],
    ...
  })
```

**stereo** -- `src/stereo.module.ts`:
```diff
- import { NatsModule, MongodbModule } from '@env/core'
+ import { NatsModule } from '@infra/nats/nats.module'
+ import { MongodbModule } from '@infra/persistence/mongodb.module'

  @Module({
    imports: [NatsModule, MongodbModule],
    ...
  })
```

**Other micros (authority, slim-shady, backstage, soundgarden, mockingbird, hybrid-storage):**
These do **not** currently import `@env/core`. They already wire their own MongoDB or do not use shared infra modules. However, if any of them import `NatsModule` from `@env/core` indirectly (check app.module.ts), replace with local NatsModule. Check each micro's `app.module.ts` during execution.
