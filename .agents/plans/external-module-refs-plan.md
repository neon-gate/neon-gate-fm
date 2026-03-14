# External Module Reference Updates Plan

Update references to the renamed AI modules (transcription→fort-minor, fingerprint→petrified, sempiternal→shinod-ai) across other microservices, infrastructure, environment variables, and documentation.

---

## Scope Overview

| Area | Current | Target | Notes |
|------|---------|--------|------|
| Docker MongoDB service | mongo-sempiternal | mongo-shinod-ai | Align with microservice name |
| Docker volumes | mongo_sempiternal_data | mongo_shinod_ai_data | Data migration risk |
| Soundgarden storage refs | fingerprint, transcription | petrified, fortMinor | Payload and port alignment |
| Soundgarden env vars | FINGERPRINT_STORAGE_*, TRANSCRIPTION_STORAGE_* | PETRIFIED_STORAGE_*, FORT_MINOR_STORAGE_* | Optional; fallback supported |
| MinIO bucket names | fingerprints, transcripts | petrified, fort-minor | Optional; defer (requires migration) |
| Bin scripts | mongo-sempiternal | mongo-shinod-ai | Match docker-compose |
| Comments/docs | track.fingerprint.generated | track.petrified.generated | Minor fix in reasoning module |

---

## Implementation Status

- [x] Docker: Rename mongo-sempiternal → mongo-shinod-ai (service, container, volume)
- [x] Bin scripts: docker-ps, docker-down, docker-up
- [x] Shinod-AI: Fix stereo module comment
- [x] Soundgarden: Add petrified/fortMinor storage refs, update MinioStorageAdapter and upload use case
- [x] Shinod-AI petrified consumer: Prefer petrifiedStorage/fortMinorStorage with fallbacks
- [x] Environment variables: PETRIFIED_*/FORT_MINOR_* with FINGERPRINT_*/TRANSCRIPTION_* fallbacks
- [ ] Optional: MinIO bucket renames (deferred; requires data migration)

---

## Migration and Rollback

- **MONGO_URI**: If using Docker, update `MONGO_URI` from `mongodb://mongo-sempiternal:27017` to `mongodb://mongo-shinod-ai:27017`.
- **Docker volume rename**: Existing `mongo_sempiternal_data` will be orphaned on first `docker compose down --volumes`. To preserve data: copy volume before down, or run a one-off rename. Fresh installs: no issue.
- **Event payload**: Backward compatibility via `??` fallbacks ensures old Soundgarden + new shinod-ai (and vice versa) keep working during rollout.
- **Env vars**: Supporting both old and new prefixes avoids breaking existing deployments.

---

## Out of Scope

- **Redis (redis-cognition)**: Name unchanged; "cognition" is a separate concept.
- **Reasoning domain fields**: `fingerprintHash`, `transcriptionText`, etc. remain as domain terms.
- **MinIO bucket names**: Changing `fingerprints`/`transcripts` requires migration; defer unless explicitly required.
