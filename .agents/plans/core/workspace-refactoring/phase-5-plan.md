## Constraints

- **NEVER modify `@pack/kernel`** -- use its abstractions, don't change them
- **No shared infra between micros** -- each micro owns its own Mongo/Redis/MinIO
- **NATS stays shared** -- single event plane for the entire platform
- **Don't break `pnpm infra`** -- docker scripts must work end-to-end after refactoring
- **Follow GENERAL_CODE_GUIDELINE.md and BACKEND_CODE_GUIDELINE.md** throughout
- **Domain service migration is a separate task** -- this plan covers package/infra/orchestration only
- **Each phase must leave the workspace in a buildable state** -- no intermediate breakage

## Phase 5 -- Dockerfile and .env Updates

### 5.1 Fix Backstage Dockerfile Bug

In `repos/domain/realtime/backstage/Dockerfile`, line 14 has an incorrect WORKDIR:

```diff
- WORKDIR /workspace/repos/domain/ai/backstage
+ WORKDIR /workspace/repos/domain/realtime/backstage
```

### 5.2 Verify All Dockerfiles

Every micro already has a Dockerfile. Verify the following for each:

| Micro | Dockerfile Path | Expected WORKDIR | Expected EXPOSE |
|-------|----------------|------------------|-----------------|
| authority | `repos/domain/identity/authority/Dockerfile` | `/workspace/repos/domain/identity/authority` | 7000 |
| slim-shady | `repos/domain/identity/slim-shady/Dockerfile` | `/workspace/repos/domain/identity/slim-shady` | 7400 |
| soundgarden | `repos/domain/streaming/soundgarden/Dockerfile` | `/workspace/repos/domain/streaming/soundgarden` | 7100 |
| backstage | `repos/domain/realtime/backstage/Dockerfile` | `/workspace/repos/domain/realtime/backstage` | 4001 |
| petrified | `repos/domain/ai/petrified/Dockerfile` | `/workspace/repos/domain/ai/petrified` | 7201 |
| fort-minor | `repos/domain/ai/fort-minor/Dockerfile` | `/workspace/repos/domain/ai/fort-minor` | 7202 |
| stereo | `repos/domain/ai/stereo/Dockerfile` | `/workspace/repos/domain/ai/stereo` | 7203 |
| mockingbird | `repos/domain/streaming/mockingbird/Dockerfile` | `/workspace/repos/domain/streaming/mockingbird` | 7200 |
| hybrid-storage | `repos/domain/streaming/hybrid-storage/Dockerfile` | `/workspace/repos/domain/streaming/hybrid-storage` | 7300 |

### 5.3 Update .env.template Files

Every micro's `.env.template` must reference its **own** infra endpoints instead of shared ones.

**`repos/domain/identity/authority/.env.template`**:
```env
PORT=7000
MONGO_URI=mongodb://authority-mongo:27017
MONGO_DB_NAME=pulse-authority
JWT_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=
NATS_URL=nats://nats:4222
```

**`repos/domain/identity/slim-shady/.env.template`**:
```env
PORT=7400
MONGO_URI=mongodb://slim-shady-mongo:27017
MONGO_DB_NAME=pulse-slim-shady
NATS_URL=nats://nats:4222
```

**`repos/domain/realtime/backstage/.env.template`**:
```env
PORT=4001
MONGO_URI=mongodb://backstage-mongo:27017
MONGO_DB_NAME=backstage
NATS_URL=nats://nats:4222
MOCK_MODE=false
```

**`repos/domain/ai/petrified/.env.template`**:
```env
PORT=7201
NATS_URL=nats://nats:4222
NATS_QUEUE_GROUP=petrified-workers
REDIS_URL=redis://petrified-redis:6379
STORAGE_ENDPOINT=http://petrified-minio:9000
STORAGE_REGION=us-east-1
STORAGE_ACCESS_KEY=minioadmin
STORAGE_SECRET_KEY=minioadmin
```

**`repos/domain/ai/fort-minor/.env.template`**:
```env
PORT=7202
NATS_URL=nats://nats:4222
NATS_QUEUE_GROUP=fort-minor-workers
REDIS_URL=redis://fort-minor-redis:6379
STORAGE_ENDPOINT=http://fort-minor-minio:9000
STORAGE_REGION=us-east-1
STORAGE_ACCESS_KEY=minioadmin
STORAGE_SECRET_KEY=minioadmin
OPENAI_API_KEY=
AI_MODEL=whisper-1
```

**`repos/domain/ai/stereo/.env.template`**:
```env
PORT=7203
NATS_URL=nats://nats:4222
NATS_QUEUE_GROUP=stereo-workers
MONGO_URI=mongodb://stereo-mongo:27017
MONGO_DB_NAME=stereo
OPENAI_API_KEY=
AI_MODEL=gpt-4o-mini
```

**`repos/domain/streaming/soundgarden/.env.template`**:
```env
PORT=7100
NATS_URL=nats://nats:4222
UPLOAD_MAX_SIZE_BYTES=52428800
UPLOAD_STORAGE_PATH=/tmp/uploads
UPLOAD_STORAGE_BUCKET=uploads
STORAGE_ENDPOINT=http://soundgarden-minio:9000
STORAGE_REGION=us-east-1
STORAGE_ACCESS_KEY=minioadmin
STORAGE_SECRET_KEY=minioadmin
```

**`repos/domain/streaming/mockingbird/.env.template`**:
```env
PORT=7200
NATS_URL=nats://nats:4222
STORAGE_ENDPOINT=http://mockingbird-minio:9000
STORAGE_REGION=us-east-1
STORAGE_ACCESS_KEY=minioadmin
STORAGE_SECRET_KEY=minioadmin
STORAGE_UPLOADS_BUCKET=uploads
STORAGE_TRANSCODED_BUCKET=transcoded
```

**`repos/domain/streaming/hybrid-storage/.env.template`**:
```env
PORT=7300
NATS_URL=nats://nats:4222
STORAGE_ENDPOINT=http://hybrid-storage-minio:9000
STORAGE_REGION=us-east-1
STORAGE_ACCESS_KEY=minioadmin
STORAGE_SECRET_KEY=minioadmin
STORAGE_TRANSCODED_BUCKET=transcoded
```

### 5.4 Remove Duplicate Nested .env.template Files

Delete these files (they are duplicates of the root-level .env.template for each micro):
- `repos/domain/ai/petrified/src/petrified/.env.template`
- `repos/domain/ai/stereo/src/stereo/.env.template`
- `repos/domain/ai/fort-minor/src/fort-minor/.env.template`
