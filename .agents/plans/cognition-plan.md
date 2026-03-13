  # FEATURE PLAN

  ## AI Cognition

  This plan describes a simplified MVP architecture: minimal infrastructure, direct event processing, no job queues or observability stack.

  ### ROLE

  You are a senior distributed systems engineer designing the AI cognition layer within a distributed music streaming platform.

  - Follow the architectural conventions used in the existing Auth microservice.
  - Reference implementation: `domain/identity/auth`
  - The system uses Clean Architecture and Ports & Adapters.
  - Also follow our Code Guidelines here: `.agents/rules/backend-code-design.md`

  ---

  ## SYSTEM OVERVIEW

  | | |
  |---|---|
  | **Project type** | Spotify-like music streaming platform where users upload songs that go through a distributed processing pipeline. |
  | **Architecture style** | Event-Driven Microservices (MVP: direct processing, no job queues). |
  | **Event bus** | NATS. |
  | **MVP infrastructure** | NATS + PostgreSQL + Object Storage only. |

  ---

  ## CORE TECHNOLOGIES

  - Node.js microservices
  - NestJS framework
  - Clean Architecture
  - Ports and Adapters
  - Event-driven messaging via NATS
  - PostgreSQL (state storage)
  - Object storage (MinIO local dev, S3 production)
  - Dockerized services
  - **Object storage:** Microservices download from storage, not shared filesystem
  - **Fingerprinting:** FFmpeg + Chromaprint (acoustic fingerprints); optional AcoustID for song identification
  - **Transcription:** Vercel AI SDK Core (`experimental_transcribe`) with provider (e.g. `@ai-sdk/openai`, `@ai-sdk/groq`)
  - **Reasoning:** AI SDK provider APIs (`generateObject`, `generateText`) for copyright, content policy, metadata inference

  ---

  ## AI COGNITION PURPOSE

  The AI Cognition layer is responsible for **understanding the uploaded audio**.

  **Responsibilities include:**

  - identifying known songs
  - generating audio fingerprints
  - transcribing lyrics
  - performing AI reasoning over the content
  - detecting copyright issues
  - deciding whether a track is approved for the pipeline

  **The AI Cognition layer does not:**

  - handle file uploads
  - transcode audio
  - serve audio to users
  - store final media files

  Those responsibilities belong to other services.

  ---

  ## AI COGNITION ARCHITECTURE

  The cognition layer is intentionally split into multiple services.

  - Each service has a single responsibility and communicates via events.

  **Services included:**

  - `fingerprint-service`
  - `transcription-service`
  - `reasoning-service`

  **This design improves:**

  - debuggability
  - testability
  - horizontal scalability
  - fault isolation

  ---

  ## PIPELINE CONTEXT

  The cognition layer operates immediately after Soundgarden.

  **Pipeline overview:**

  ```mermaid
  flowchart TB
    subgraph soundgarden [Soundgarden]
      SG[Upload + Object Storage]
    end
    subgraph cognition [AI Cognition Layer]
      FP[Fingerprint Service]
      TR[Transcription Service]
      RE[Reasoning Service]
    end
    subgraph downstream [Downstream]
      MB[Mockingbird]
      FM[Fort-Minor]
    end
    SG -->|track.uploaded| FP
    FP -->|track.fingerprint.generated| TR
    FP -->|track.fingerprint.generated| RE
    TR -->|track.transcription.completed| RE
    RE -->|track.approved| MB
    RE -.->|track.rejected| Stop[Pipeline Stop]
    MB --> FM
  ```

  **Complete pipeline:**

  ```
  Client
    ↓
  BFF
    ↓
  Soundgarden (upload service)
    ↓
  Object Storage
    ↓
  track.uploaded
    ↓
  Fingerprint Service
    ↓
  track.fingerprint.generated
    ↓
  Transcription Service
    ↓
  track.transcription.completed
    ↓
  Reasoning Service
    ↓
  track.approved
    ↓
  Mockingbird (transcoding)
    ↓
  Fort-Minor (delivery storage)
    ↓
  Streaming CDN
  ```

  **Industry alignment:** This mirrors Spotify-like pipelines: Upload → Object Storage → Processing Queue → Fingerprinting → Content ID → Transcoding → Metadata enrichment → Catalog. AI cognition sits between Fingerprinting and Metadata enrichment.

  ---

  ## NATS SUBSCRIPTION ARCHITECTURE

  Each service subscribes using queue groups for load balancing across multiple instances.

  | Subject | Service | Queue group |
  |---------|---------|-------------|
  | `track.uploaded` | fingerprint-service | fingerprint-workers |
  | `track.fingerprint.generated` | transcription-service | transcription-workers |
  | `track.fingerprint.generated` | reasoning-service | reasoning-workers |
  | `track.transcription.completed` | reasoning-service | reasoning-workers |

  **Benefits:** Multiple instances, load-balanced processing.

  ---

  ## EVENT NAMING CONVENTION

  All event subjects follow: `domain.entity.action`

  **Examples used across the platform:**

  - `track.uploaded`
  - `track.fingerprint.generated`
  - `track.song.detected`
  - `track.transcription.started`
  - `track.transcription.completed`
  - `track.reasoning.started`
  - `track.approved`
  - `track.rejected`
  - `track.metadata.validation.failed`
  - `track.duplicate.detected`
  - `track.processing.timeout`

  ---

  ## EVENT ENVELOPE

  All events in the system must follow a standard envelope format.

  **Example:**

  ```json
  {
    "eventId": "uuid",
    "eventType": "track.transcription.completed",
    "timestamp": "2025-03-13T12:00:00Z",
    "source": "transcription-service",
    "version": 1,
    "payload": {}
  }
  ```

  **Rules:**

  - `eventId` must be UUID v7
  - `timestamp` must be ISO 8601
  - `version` supports event schema evolution
  - `source` identifies emitting service

  All services must publish and consume events using this envelope.

  ---

  ## EVENT SCHEMA VERSIONING

  All events must include a version number.

  **Implementation options:**

  - Include `version` in the event envelope (recommended)
  - Or use versioned subject names: `track.transcription.completed.v1`

  Consumers must support backward compatibility when schema evolves.

  ---

  ## EVENT SCHEMA (MVP)

  Schemas exist as static files inside the codebase. No schema registry service or runtime discovery.

  **Structure:**

  ```
  packages/event-schemas/
  ├── track.uploaded.v1.json
  ├── fingerprint.generated.v1.json
  ├── transcription.completed.v1.json
  └── track.approved.v1.json
  ```

  Each microservice imports the shared schemas and performs local validation.

  **Processing flow:**

  ```
  receive event
      ↓
  validate schema (local package)
      ↓
  process event
  ```

  Invalid events are logged and discarded during MVP.

  ---

  ## IDEMPOTENCY

  Event consumers must tolerate duplicate events.

  **Rules:**

  - Each service must store processed events
  - Duplicate events must be ignored

  **Example storage schema:**

  ```
  processed_events
  ├── eventId
  ├── serviceName
  └── processedAt
  ```

  **Processing flow:**

  ```
  if eventId already exists:
      ignore event
  else:
      process event
      store eventId
  ```

  This prevents duplicate reasoning or transcription runs.

  ---

  ## EVENT JOIN STRATEGY

  The Reasoning Service depends on multiple upstream signals.

  **Reasoning must start only after both signals exist:**

  - `track.fingerprint.generated`
  - `track.transcription.completed`

  Services must implement event aggregation state.

  **Example table:**

  ```
  track_processing_state
  ├── trackId
  ├── fingerprintReady
  ├── transcriptionReady
  └── reasoningStarted
  ```

  **Processing rule:**

  ```
  IF fingerprintReady == true
  AND transcriptionReady == true
  AND reasoningStarted == false
  THEN start reasoning
  ```

  **Aggregator processing flow:**

  ```
  event received
      ↓
  update state (fingerprint.generated → fingerprintReady=true; transcription.completed → transcriptionReady=true)
      ↓
  check readiness
      ↓
  if fingerprintReady && transcriptionReady && !reasoningStarted:
      reasoningStarted = true
      publish track.reasoning.started
      run reasoning
  ```

  This prevents race conditions, pipeline stalls, and duplicate reasoning when events arrive out of order.

  ---

  ## RETRY STRATEGY

  Transient failures must automatically retry.

  **Retry configuration:**

  | Setting | Value |
  |---------|-------|
  | max attempts | 3 |
  | strategy | exponential backoff |
  | base delay | 2 seconds |
  | max delay | 30 seconds |

  **Retryable errors:**

  - `MODEL_TIMEOUT`
  - `NETWORK_FAILURE`
  - `TEMPORARY_IO_FAILURE`

  **Non-retryable errors:**

  - `CORRUPTED_AUDIO`
  - `UNSUPPORTED_FORMAT`
  - `INVALID_PAYLOAD`

  ---

  ## MVP PROCESSING MODEL

  Event consumers process messages directly when they arrive. No internal job queues.

  **Flow:**

  ```
  NATS event
      ↓
  service handler
      ↓
  execute processing
      ↓
  publish next event
  ```

  **Concurrency:** Control using simple config per service:

  ```
  MAX_CONCURRENT_AI_TASKS=3
  ```

  Each microservice acts as a direct event processor.

  ---

  ## AI TIMEOUT POLICY

  External AI inference must enforce timeouts.

  **Example:**

  | Operation | Timeout |
  |-----------|---------|
  | transcription | 60s |
  | reasoning | 30s |

  Timeout failures must emit `MODEL_TIMEOUT`.

  ---

  ## CIRCUIT BREAKER (Mandatory)

  AI providers are external dependencies and must be protected. Circuit breaker must remain in the architecture.

  **Behavior:**

  ```
  if AI failures exceed threshold
      ↓
  open circuit
      ↓
  pause AI requests
      ↓
  retry after cooldown
  ```

  **Must wrap:**

  - transcription AI calls
  - reasoning AI calls
  - fingerprint AI calls (if applicable)

  This protects the system from external service outages.

  ---

  ## PIPELINE TIMEOUT PROTECTION

  Tracks stuck mid-pipeline must be detected.

  **Rule:** If track not approved/rejected within 10 minutes → emit `track.processing.timeout`.

  **Handled by:** Watchdog service (or cron job within a service).

  **Event:** `track.processing.timeout` — add to EVENT NAMING CONVENTION (already listed).

  ---

  ## SERVICE HEALTH CHECKS

  Each service must expose:

  ```
  GET /health
  ```

  **Checks must validate:**

  - NATS connectivity
  - AI provider availability
  - object storage connectivity (for audio download/upload)

  ---

  ## SERVICE: FINGERPRINT SERVICE

  **Purpose:** Generate an audio fingerprint for the uploaded track and attempt to identify known songs.

  **Technology:** FFmpeg + Chromaprint

  - **FFmpeg:** Decode uploaded audio (MP3, WAV) to raw PCM. Reference: `domain/streaming/mockingbird/src/mocking-bird/infra/transcoder/ffmpeg-transcoder.adapter.ts`.
  - **Chromaprint:** Generate acoustic fingerprints from raw audio. Use `chromaprint` npm package (JS port) or `fpcalc` CLI. Flow: `audio file → FFmpeg (decode) → raw PCM → Chromaprint.fingerprint()`.
  - **AcoustID (optional):** Use AcoustID web API for song identification; `node-acoustid` can assist (requires `fpcalc` installed).

  **Responsibilities:**

  - Consume `track.uploaded`
  - Download audio from object storage to temp file
  - Compute `audioHash = SHA256(audio)` — store for duplicate detection
  - If identical hash exists for another track → emit `track.duplicate.detected` (do not proceed)
  - Generate acoustic fingerprint via FFmpeg + Chromaprint
  - Attempt song identification (optional AcoustID lookup)
  - Publish fingerprint results
  - Delete temp file

  ### EVENTS CONSUMED BY FINGERPRINT SERVICE

  - `track.uploaded`

  **Payload (from Soundgarden):**

  ```json
  {
    "trackId": "uuid",
    "storage": {
      "bucket": "tracks",
      "key": "uploads/{trackId}/original.mp3"
    },
    "uploadedAt": "timestamp"
  }
  ```

  **Storage:** Microservices must not assume a shared filesystem. Soundgarden uploads to object storage; AI Cognition services download from it.

  **Fingerprint service flow:**
  1. Receive NATS event
  2. Download from object storage to temp file
  3. Process audio (FFmpeg + Chromaprint)
  4. Delete temp file

  **Recommended storage:** MinIO (local dev), S3 (production), GCS.

  **Port:** `AudioStoragePort` / `AudioStorageAdapter` for download/upload operations.

  ### EVENTS EMITTED BY FINGERPRINT SERVICE

  - `track.fingerprint.generated`
  - `track.song.detected`
  - `track.song.unknown`
  - `track.fingerprint.failed`
  - `track.duplicate.detected` (when identical audio hash exists)

  **Example payload (`track.fingerprint.generated`):**

  ```json
  {
    "trackId": "uuid",
    "fingerprintHash": "f8ab239fa",
    "audioHash": "sha256-hex",
    "generatedAt": "2025-03-13T12:00:10.000Z"
  }
  ```

  ---

  ## SERVICE: TRANSCRIPTION SERVICE

  **Purpose:** Generate lyrics transcription from the uploaded audio.

  **Technology:** Vercel AI SDK Core (`experimental_transcribe`)

  - **Package:** `ai` + provider (e.g. `@ai-sdk/openai`, `@ai-sdk/groq`).
  - **API:** `experimental_transcribe` from `ai`.
  - **Input:** `Buffer` or `Uint8Array` from file read; also supports URL with `createDownload` for size limits (default 2 GiB; configurable).
  - **Output:** `transcript.text`, `transcript.language`, `transcript.segments`, `transcript.durationInSeconds`.
  - **Error handling:** `NoTranscriptGeneratedError` (preserves `cause`, `responses`); `DownloadError` when URL exceeds size limit.
  - **Settings:** `abortSignal` (timeouts), `providerOptions`, `headers` as needed.
  - **Note:** Transcription is an experimental feature in the AI SDK.
  - **Timeout:** 60s (see [AI Timeout Policy](#ai-timeout-policy)).
  - **Instrumental audio:** Some tracks contain no speech. Transcription may produce empty transcript (`text === ""`). This must not fail the pipeline; emit `track.transcription.completed` with empty text.

  **Responsibilities:**

  - Consume fingerprint results
  - Run `experimental_transcribe` with chosen provider model
  - Generate transcription output
  - Publish transcription results

  ### EVENTS CONSUMED BY TRANSCRIPTION SERVICE

  - `track.fingerprint.generated`

  ### EVENTS EMITTED BY TRANSCRIPTION SERVICE

  - `track.transcription.started`
  - `track.transcription.completed`
  - `track.transcription.failed`

  **Example payload (`track.transcription.completed`):**

  ```json
  {
    "trackId": "uuid",
    "language": "en",
    "text": "This is ten percent luck...",
    "segments": [{ "start": 0, "end": 2.5, "text": "..." }],
    "durationInSeconds": 180.5
  }
  ```

  ---

  ## SERVICE: REASONING SERVICE

  **Purpose:** Perform higher-level AI reasoning over the track and validate metadata before approval.

  **Technology:** AI SDK (provider-agnostic) — use `generateObject`, `generateText` for copyright detection, content policy, metadata inference. Reuse existing `@ai-sdk/*` patterns from the frontend where applicable.

  - **Timeout:** 30s (see [AI Timeout Policy](#ai-timeout-policy)).
  - **Instrumental audio:** Reasoning must handle `transcript.length == 0` or `transcript.text === ""` without failing the pipeline. Treat as valid (e.g., approve with metadata indicating no lyrics).

  **Responsibilities include:**

  - copyright detection
  - content policy checks
  - metadata inference
  - **metadata validation** — ensures inferred or user-provided metadata (artist, title, album, etc.) meets quality rules (format, completeness, coherence with fingerprint/transcription) before emitting `track.approved`
  - approval decisions

  ### EVENTS CONSUMED BY REASONING SERVICE

  - `track.fingerprint.generated` — join signal (fingerprint ready)
  - `track.transcription.completed` — join signal (transcription ready)

  **Note:** `track.song.detected` provides optional metadata when a known song is identified; it does **not** gate the join. Reasoning starts when both `track.fingerprint.generated` and `track.transcription.completed` exist.

  ### EVENTS EMITTED BY REASONING SERVICE

  - `track.reasoning.started`
  - `track.approved`
  - `track.rejected`
  - `track.reasoning.failed`
  - `track.metadata.validation.failed`

  **Example payload (`track.approved`):**

  ```json
  {
    "trackId": "uuid",
    "decision": "approved",
    "reason": "Original track"
  }
  ```

  ---

  ## DECISION OUTCOMES

  Possible reasoning results:

  - `approved`
  - `rejected`
  - `needs_review`

  - **Approved** tracks proceed to Mockingbird for transcoding.
  - **Rejected** tracks stop the pipeline.

  ---

  ## CLEAN ARCHITECTURE STRUCTURE

  Each AI cognition service should follow the same architecture structure.

  **Example layout:** `domain/ai-cognition/fingerprint`

  **Structure (per** [`.agents/rules/backend-code-design.md`](../rules/backend-code-design.md)**):**

  - `application` — use cases, services
  - `domain` — entities, value objects, events, ports
  - `infra` — adapters (not `infrastructure`)
  - `interface` — HTTP controllers, DTOs, pipes, event handlers

  **Ideal folder structure (fingerprint service example):**

  ```
  domain/ai-cognition/fingerprint/
  src/
  ├── application/
  │   ├── use-cases/
  │   │   └── generate-fingerprint.use-case.ts
  │   └── services/
  ├── domain/
  │   ├── entities/
  │   │   └── track.entity.ts
  │   ├── value-objects/
  │   ├── events/
  │   │   └── fingerprint-event.map.ts
  │   └── ports/
  │       ├── fingerprint-generator.port.ts
  │       └── audio-storage.port.ts
  ├── infra/
  │   └── adapters/
  │       ├── chromaprint.adapter.ts
  │       ├── s3-storage.adapter.ts
  │       └── nats-eventbus.adapter.ts
  ├── interface/
  │   └── event-handlers/
  │       └── track-uploaded.handler.ts
  ├── config/
  └── main.ts
  ```

  **Ports and events:**

  - Ports are **abstract classes**, not TypeScript interfaces.
  - Events extend Kernel `Event` / `DomainEvent`.
  - Use an `EventMap` (typed map of event names → payloads), same pattern as `domain/identity/auth/src/auth/domain/events/auth-event.map.ts`.
  - Use `EventBus<EventMap>` from `@repo/kernel` with `NatsEventBusAdapter` from `packages/event-bus`.

  ---

  ## OBSERVABILITY (MVP)

  Minimal structured logging only. No OpenTelemetry, Prometheus, or Grafana.

  Each service should log structured events:

  ```json
  {
    "service": "fingerprint-service",
    "trackId": "...",
    "event": "fingerprint.generated",
    "status": "success"
  }
  ```

  Logs are used for debugging during MVP development.

  ---

  ## ERROR HANDLING (MVP)

  Errors handled through: **structured logging** + **retry with exponential backoff** (see [Retry Strategy](#retry-strategy)).

  If processing fails repeatedly, the event can be ignored and investigated via logs during the MVP phase.

  **Possible error codes:**

  - `FINGERPRINT_GENERATION_FAILED`
  - `TRANSCRIPTION_FAILED`
  - `TRANSCRIPT_DOWNLOAD_FAILED`
  - `AI_REASONING_FAILED`
  - `METADATA_VALIDATION_FAILED`
  - `MODEL_TIMEOUT`
  - `NETWORK_FAILURE` (retryable)
  - `TEMPORARY_IO_FAILURE` (retryable)
  - `CORRUPTED_AUDIO` (non-retryable)
  - `UNSUPPORTED_FORMAT` (non-retryable)
  - `INVALID_PAYLOAD` (non-retryable)

  **Reprocessing (MVP):** If reprocessing is needed during development, manually republish events: `nats pub track.uploaded <payload>`

  ---

  ## PERFORMANCE CONSIDERATIONS

  AI inference workloads can be heavy. Services process events directly (see [MVP Processing Model](#mvp-processing-model)). Use `MAX_CONCURRENT_AI_TASKS` to limit concurrency per service.

  ---

  ## IMPLEMENTATION PHASES

  ### Phase 1 — fingerprinting

  - Implement fingerprint service with FFmpeg + Chromaprint
  - Consume `track.uploaded` (object storage payload)
  - Download from object storage, compute audioHash (SHA256), check for duplicates
  - Emit fingerprint events (`track.fingerprint.generated`, `track.song.detected`, `track.song.unknown`, `track.fingerprint.failed`, `track.duplicate.detected`)
  - Optional: AcoustID lookup for song identification

  ### Phase 2 — transcription

  - Implement transcription service with AI SDK `experimental_transcribe`
  - Support Buffer/URL; handle `NoTranscriptGeneratedError`, `DownloadError`
  - Emit enriched transcription payload (`text`, `segments`, `durationInSeconds`)

  ### Phase 3 — reasoning

  - Implement reasoning service with AI SDK (`generateObject`, `generateText`)
  - Add metadata validation step within reasoning
  - Emit approval events (`track.approved`, `track.rejected`, `track.metadata.validation.failed`)

  ---

  ## MVP INFRASTRUCTURE

  After simplification, the architecture depends only on:

  - **NATS** (event bus)
  - **PostgreSQL** (state storage: idempotency, track_processing_state)
  - **Object Storage** (audio files — MinIO local dev, S3 production)

  No Redis, job queues, observability stack, or event replay infrastructure.

  ---

  ## DOCKER AND DEPENDENCIES

  - **Fingerprint service:** FFmpeg in image (like Mockingbird Dockerfile); Chromaprint via npm or `fpcalc` in image.
  - **Transcription service:** Node only; AI SDK + provider packages (`ai`, `@ai-sdk/openai` or `@ai-sdk/groq`).
  - **Reasoning service:** Node only; AI SDK + provider.
  - **docker-compose.yml:** Add NATS, PostgreSQL, MinIO (or S3-compatible storage), fingerprint-service, transcription-service, reasoning-service with `NATS_URL`, database URL, storage credentials, and provider keys (e.g. `OPENAI_API_KEY`).

  ---

  ## OUTPUT EXPECTATION

  When implementing the AI Cognition services:

  - Follow Clean Architecture patterns
  - Reuse existing NATS abstraction (`packages/event-bus`, `packages/kernel`)
  - Emit events instead of calling services directly
  - Keep services isolated
  - Create Dockerfile per service
  - Update `docker-compose.yml`
  - Add smoke tests for each service
  - Implement event envelope, idempotency, retry with exponential backoff, circuit breaker for AI calls
  - Use object storage (not filePath); validate schemas locally (`packages/event-schemas`); direct event processing (no job queues); minimal structured logging; compute content hash for duplicate detection

  **Design goal:** Simplicity, readability, minimal infrastructure, fewer operational dependencies.
