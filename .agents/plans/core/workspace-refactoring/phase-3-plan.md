## Constraints

- **NEVER modify `@pack/kernel`** -- use its abstractions, don't change them
- **No shared infra between micros** -- each micro owns its own Mongo/Redis/MinIO
- **NATS stays shared** -- single event plane for the entire platform
- **Don't break `pnpm infra`** -- docker scripts must work end-to-end after refactoring
- **Follow GENERAL_CODE_GUIDELINE.md and BACKEND_CODE_GUIDELINE.md** throughout
- **Domain service migration is a separate task** -- this plan covers package/infra/orchestration only
- **Each phase must leave the workspace in a buildable state** -- no intermediate breakage


## Phase 3 -- Update All Imports

### 3.1 `@env/lib` -> `@pack/environment` (~24 import sites)

**Find-and-replace**: `from '@env/lib'` -> `from '@pack/environment'`

Complete file list:

| Micro | Files |
|-------|-------|
| authority | `src/main.ts`, `src/app.module.ts`, `src/authority/authority.module.ts`, `src/authority/application/services/authority-token.service.ts`, `src/authority/infra/oauth/google-oauth.adapter.ts`, `src/authority/interface/http/guards/access-token.guard.ts`, `src/authority/application/use-cases/refresh-token.usecase.ts`, `src/authority/application/use-cases/logout.usecase.ts` |
| slim-shady | `src/main.ts`, `src/app.module.ts` |
| soundgarden | `src/main.ts`, `src/soundgarden/infra/upload-config.ts`, `src/soundgarden/infra/object-storage/minio-storage.adapter.ts` |
| backstage | `src/main.ts`, `src/app.module.ts` |
| petrified | `src/main.ts`, `src/petrified/interface/consumers/track-uploaded.consumer.ts` |
| fort-minor | `src/main.ts`, `src/fort-minor/infra/adapters/ai-sdk-transcriber.adapter.ts`, `src/fort-minor/interface/consumers/petrified-generated.consumer.ts` |
| stereo | `src/main.ts`, `src/stereo/interface/consumers/petrified-generated.consumer.ts`, `src/stereo/interface/consumers/transcription-completed.consumer.ts`, `src/stereo/infra/adapters/ai-sdk-stereo.adapter.ts` |
| mockingbird | `src/main.ts`, `src/mockingbird/infra/storage/minio-storage.adapter.ts` |

### 3.2 `@env/event-inventory` -> `@pack/event-inventory` (~35 import sites)

**Find-and-replace**: `from '@env/event-inventory'` -> `from '@pack/event-inventory'`

Complete file list:

| Micro | Files |
|-------|-------|
| authority | `src/authority/domain/events/authority-event.map.ts`, `src/authority/domain/events/user-signed-up.event.ts`, `src/authority/domain/events/user-logged-in.event.ts`, `src/authority/domain/events/user-logged-out.event.ts`, `src/authority/domain/events/token-refreshed.event.ts`, `src/authority/application/use-cases/google-signup.usecase.ts`, `src/authority/application/use-cases/google-login.usecase.ts`, `src/authority/application/use-cases/login.usecase.ts`, `src/authority/application/use-cases/signup.usecase.ts`, `src/authority/application/use-cases/refresh-token.usecase.ts`, `src/authority/application/use-cases/logout.usecase.ts`, `src/authority/interface/consumers/user-profile-created.consumer.ts` |
| slim-shady | `src/slim-shady/domain/events/slim-shady-event.map.ts`, `src/slim-shady/domain/events/user-profile-created.event.ts`, `src/slim-shady/domain/events/user-profile-updated.event.ts`, `src/slim-shady/domain/events/user-profile-deleted.event.ts`, `src/slim-shady/application/use-cases/create-user-profile.usecase.ts`, `src/slim-shady/application/use-cases/complete-onboarding.usecase.ts`, `src/slim-shady/application/use-cases/update-user-profile.usecase.ts`, `src/slim-shady/application/use-cases/update-user-preferences.usecase.ts`, `src/slim-shady/interface/consumers/user-signed-up.consumer.ts` |
| soundgarden | `src/soundgarden/domain/events/track-event.map.ts`, `src/soundgarden/application/use-cases/upload-track.usecase.ts` |
| backstage | `src/backstage/domain/entities/track-pipeline.entity.ts`, `src/backstage/infra/mock/pipeline-event-messages.data.ts`, `src/backstage/infra/mock/mock-event-generator.service.ts` |
| petrified | `src/petrified/domain/events/petrified-event.map.ts`, `src/petrified/application/use-cases/generate-fingerprint.use-case.ts`, `src/petrified/interface/consumers/track-uploaded.consumer.ts` |
| fort-minor | `src/fort-minor/domain/events/fort-minor-event.map.ts`, `src/fort-minor/application/use-cases/transcribe-track.use-case.ts`, `src/fort-minor/interface/consumers/petrified-generated.consumer.ts` |
| stereo | `src/stereo/domain/events/stereo-event.map.ts`, `src/stereo/application/use-cases/run-stereo.use-case.ts`, `src/stereo/interface/consumers/petrified-generated.consumer.ts`, `src/stereo/interface/consumers/transcription-completed.consumer.ts` |
| mockingbird | `src/mockingbird/domain/events/mockingbird-event.map.ts`, `src/mockingbird/application/use-cases/transcode-track.usecase.ts`, `src/mockingbird/interface/consumers/track-approved.consumer.ts` |
| hybrid-storage | `src/hybrid-storage/domain/events/hybrid-storage-event.map.ts`, `src/hybrid-storage/application/use-cases/persist-hls-package.use-case.ts`, `src/hybrid-storage/interface/consumers/hls-generated.consumer.ts`, `src/hybrid-storage/infra/mock/mock-hls-generator.service.ts` |

### 3.3 `@env/core` -> Local Infra Modules (~8 import sites)

These are the only three micros that import from `@env/core`:

**petrified**:
| File | Old Import | New Import |
|------|-----------|------------|
| `src/petrified.module.ts` | `NatsModule, RedisModule, MinioModule` from `@env/core` | Local `NatsModule`, `RedisModule`, `StorageModule` |
| `src/petrified/application/use-cases/generate-fingerprint.use-case.ts` | `AudioStoragePort` from `@env/core` | `AudioStoragePort` from `@domain/ports/audio-storage.port` |
| `src/petrified/infra/adapters/redis-idempotency.adapter.ts` | `REDIS_CLIENT` from `@env/core` | `REDIS_CLIENT` from `@infra/redis/redis.module` |
| `src/petrified/infra/adapters/redis-audio-hash.adapter.ts` | `REDIS_CLIENT` from `@env/core` | `REDIS_CLIENT` from `@infra/redis/redis.module` |

**fort-minor**:
| File | Old Import | New Import |
|------|-----------|------------|
| `src/app.module.ts` | `NatsModule, RedisModule, MinioModule` from `@env/core` | Local `NatsModule`, `RedisModule`, `StorageModule` |
| `src/fort-minor/application/use-cases/transcribe-track.use-case.ts` | `AudioStoragePort` from `@env/core` | `AudioStoragePort` from `@domain/ports/audio-storage.port` |
| `src/fort-minor/infra/adapters/redis-idempotency.adapter.ts` | `REDIS_CLIENT` from `@env/core` | `REDIS_CLIENT` from `@infra/redis/redis.module` |

**stereo**:
| File | Old Import | New Import |
|------|-----------|------------|
| `src/stereo.module.ts` | `NatsModule, MongodbModule` from `@env/core` | Local `NatsModule`, `MongodbModule` |

### 3.4 Update `@pack/nats-broker-messaging` Dependency

In `repos/packages/nats-broker-messaging/package.json`, change:
```diff
  "dependencies": {
-   "@env/event-inventory": "workspace:*",
+   "@pack/event-inventory": "workspace:*",
    "@pack/kernel": "workspace:*",
    "nats": "^2.17.0",
    "zod": "^4"
  }
```

Also search for any internal imports of `@env/event-inventory` in `repos/packages/nats-broker-messaging/src/` and update them to `@pack/event-inventory`.

### 3.5 Update All Micro `package.json` Files

For every microservice `package.json`, apply these changes:

| Change | Old | New |
|--------|-----|-----|
| Remove `@env/core` | `"@env/core": "workspace:*"` | (delete line) |
| Rename `@env/lib` | `"@env/lib": "workspace:*"` | `"@pack/environment": "workspace:*"` |
| Rename `@env/event-inventory` | `"@env/event-inventory": "workspace:*"` | `"@pack/event-inventory": "workspace:*"` |

Additionally, add infra-specific dependencies to micros that previously got them transitively via `@env/core`:

| Micro | Dependencies to add (if not already present) |
|-------|----------------------------------------------|
| petrified | `ioredis`, `@aws-sdk/client-s3` |
| fort-minor | `ioredis`, `@aws-sdk/client-s3` |
| stereo | `mongoose`, `@nestjs/mongoose` |

**Note**: `hybrid-storage` currently does not list `@env/lib` in its `package.json` but some files may use env helpers transitively. Add `"@pack/environment": "workspace:*"` if needed.

