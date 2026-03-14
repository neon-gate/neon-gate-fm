# FEATURE PLAN

Soundgarden Upload Microservice

---

# ROLE

You are a senior distributed systems engineer designing an ingestion microservice within a distributed music streaming platform.

Follow the architectural conventions used in the existing **Auth microservice**.

Reference implementation:

```
domain/identity/auth
```

The system uses **Clean Architecture** and **Ports & Adapters**.

Also follow our Code Guidelines here:

```
.agents/rules/backend-code-design.md
```

---

# SYSTEM OVERVIEW

Project type:

Spotify-like music streaming platform where users upload songs that go through a distributed processing pipeline.

Architecture style:

Event-Driven Microservices.

Event bus:

NATS

---

# CORE TECHNOLOGIES

* Node.js microservices
* NestJS framework
* Clean Architecture
* Ports and Adapters
* Event-driven messaging via NATS
* Dockerized services

---

# EXISTING ARCHITECTURE

The system already includes:

* BFF (Next.js API routes) (`apps/pulse/app/api/soundgarden`)
* Authentication microservice (`domain/identity/auth`)
* NATS event bus abstraction
* Docker Compose environment (`docker-compose.yml`)

Reference NATS abstraction:

```
packages/kernel/src/event-bus.abstract.ts
packages/kernel/src/event-error.abstract.ts
packages/kernel/src/event.abstract.ts
packages/event-bus/src
```

Soundgarden must reuse the existing messaging abstraction instead of implementing a new one.

---

# MICROSERVICE: SOUNDGARDEN

Purpose:

Handle user audio uploads and publish an event that starts the processing pipeline.

Soundgarden responsibilities:

1. Accept user audio uploads
2. Validate file format and size
3. Store the uploaded file temporarily
4. Generate a Track ID
5. Emit ingestion events to the event bus

Soundgarden does **NOT**:

* transcode audio
* perform AI analysis
* generate streaming segments
* serve playback

Those responsibilities belong to other services.

---

# STREAMING PIPELINE CONTEXT

Soundgarden is the entry point for the media ingestion pipeline.

Pipeline overview:

Client
↓
BFF
↓
Soundgarden
↓
`track.uploaded`
↓
AI Cognition Engine
↓
Mockingbird (transcoding)
↓
storage

---

# EVENT NAMING CONVENTION

All event subjects follow:

```
domain.entity.action
```

Examples used across the platform:

```
track.uploaded
track.petrified.generated
track.petrified.song.unknown
track.fort-minor.started
track.fort-minor.completed
track.stereo.started
track.approved
track.rejected
track.transcoding.started
track.transcoding.completed
track.ready
```

---

# EVENTS EMITTED BY SOUNDGARDEN

Soundgarden emits the following events.

### Upload lifecycle

```
track.upload.received
track.upload.validated
track.upload.stored
track.uploaded
```

### Error event

```
track.upload.failed
```

Example failure payload:

```json
{
  "trackId": "uuid",
  "errorCode": "FILE_TOO_LARGE",
  "message": "File exceeds maximum allowed size"
}
```

---

# TRACK IDENTIFIER

Soundgarden generates the Track ID.

Identifier format:

```
UUID v7
```

Example:

```
018f4d9c-2a77-7c3b-bb92-91c9a6a0a2b0
```

This ID will be used across the entire pipeline.

---

# ACCEPTED MEDIA TYPES

Initial supported extensions:

```
.mp3
.wav
```

Future formats may include:

```
.flac
.aac
```

Allowed MIME types:

```
audio/mpeg
audio/wav
```

---

# FILE VALIDATION RULES

Maximum upload size:

```
50MB
```

Validation rules:

* file must exist
* file must be readable
* file size must not exceed limit
* file format must match supported types

---

# ERROR CODES

Upload failures must emit deterministic error codes.

Possible values:

```
FILE_TOO_LARGE
UNSUPPORTED_FORMAT
CORRUPTED_FILE
UPLOAD_INTERRUPTED
STORAGE_FAILED
```

---

# STORAGE STRATEGY

Uploaded files are stored temporarily on disk.

Example location:

```
/tmp/uploads/{trackId}/{originalFileName}
```

Example:

```
/tmp/uploads/018f4d9c/song.mp3
```

Files remain available until the processing pipeline finishes.

Long-term storage is handled by **storage**.

---

# CLEANUP STRATEGY

Temporary uploads must expire.

Upload TTL:

```
24 hours
```

Cleanup job:

```
runs every 1 hour
removes expired uploads
```

---

# API DESIGN

Upload endpoint:

```
POST /tracks/upload
```

Request:

Multipart form data.

Fields:

```
file: audio file
metadata: optional JSON metadata
```

Response example:

```json
{
  "trackId": "uuid",
  "status": "uploaded"
}
```

---

# INTERNAL COMPONENTS

Possible modules inside Soundgarden:

1. Upload Controller
   Handles HTTP requests.

2. File Validator
   Validates file type and size.

3. File Storage Service
   Handles temporary file storage.

4. Track ID Generator
   Generates UUID v7 identifiers.

5. Event Publisher
   Publishes upload events.

---

# SECURITY

Upload endpoint requires authentication.

Authentication handled by:

```
identity/auth
```

The BFF is responsible for validating the user session before forwarding the request.

---

# OBSERVABILITY

Log upload lifecycle events:

* upload received
* upload validated
* file stored
* event published

Logs should include:

```
trackId
fileName
fileSize
timestamp
```

Future improvements may include distributed tracing.

---

# EDGE CASES

The system must handle:

* unsupported file formats
* oversized files
* corrupted uploads
* upload interruption
* duplicate uploads
* disk storage exhaustion

---

# PERFORMANCE CONSIDERATIONS

Use streaming uploads when possible.

Avoid loading entire files into memory.

---

# IMPLEMENTATION TASKS

Phase 1 — basic upload

1. Implement upload endpoint
2. Validate audio files
3. Generate Track ID
4. Store file temporarily
5. Emit upload lifecycle events

Phase 2 — robustness

6. Implement upload streaming
7. Add file cleanup job
8. Improve validation rules

---

# OUTPUT EXPECTATION

When implementing Soundgarden:

1. Follow Clean Architecture patterns
2. Reuse existing NATS abstraction
3. Emit events instead of calling services directly
4. Keep responsibilities limited to upload handling
5. Create Dockerfile
6. Update `docker-compose.yml` to include Soundgarden service
7. Create smoke tests for each endpoint

Smoke test reference:

```
bin/test/smoke/auth
```

Use mocked song:

```
bin/test/smoke/soundgarden/data/remember-the-name.mp3
```

# EVENT DESIGN

Event bus:

NATS

## Event payload schemas

### track.upload.received

```json
{
  "trackId": "018f4d9c-2a77-7c3b-bb92-91c9a6a0a2b0",
  "fileName": "song.mp3",
  "receivedAt": "2025-03-13T12:00:00.000Z"
}
```

### track.upload.validated

```json
{
  "trackId": "018f4d9c-2a77-7c3b-bb92-91c9a6a0a2b0",
  "fileName": "song.mp3",
  "fileSize": 5242880,
  "mimeType": "audio/mpeg",
  "validatedAt": "2025-03-13T12:00:01.000Z"
}
```

### track.upload.stored

```json
{
  "trackId": "018f4d9c-2a77-7c3b-bb92-91c9a6a0a2b0",
  "filePath": "/tmp/uploads/018f4d9c-2a77-7c3b-bb92-91c9a6a0a2b0/song.mp3",
  "fileName": "song.mp3",
  "fileSize": 5242880,
  "storedAt": "2025-03-13T12:00:02.000Z"
}
```

### track.uploaded

```json
{
  "trackId": "018f4d9c-2a77-7c3b-bb92-91c9a6a0a2b0",
  "filePath": "/tmp/uploads/018f4d9c-2a77-7c3b-bb92-91c9a6a0a2b0/song.mp3",
  "fileName": "song.mp3",
  "fileSize": 5242880,
  "uploadedAt": "2025-03-13T12:00:03.000Z"
}
```

### track.upload.failed

```json
{
  "trackId": "018f4d9c-2a77-7c3b-bb92-91c9a6a0a2b0",
  "errorCode": "FILE_TOO_LARGE",
  "message": "File exceeds maximum allowed size"
}
```

## Known consumers

| Event | Consumers |
|-------|-----------|
| track.upload.received | Backstage |
| track.upload.validated | Backstage |
| track.upload.stored | Backstage |
| track.uploaded | AI Cognition Engine, Backstage |
| track.upload.failed | Backstage |

Subscribers are informational only. Services must not rely on specific consumers.
