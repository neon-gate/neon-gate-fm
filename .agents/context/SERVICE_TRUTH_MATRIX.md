# Pulse Service Truth Matrix

## Runtime Topology

### Shared Infrastructure

- `nats`

### Per-Service Infrastructure

- `authority-mongo`
- `slim-shady-mongo`
- `backstage-mongo`
- `stereo-mongo`
- `petrified-redis`
- `fort-minor-redis`
- `soundgarden-minio`
- `mockingbird-minio`
- `hybrid-storage-minio`
- `petrified-minio`
- `fort-minor-minio`

## Service Matrix

| Service | Transport | Owned Infra | Emits | Consumes |
| --- | --- | --- | --- | --- |
| authority | HTTP + NATS | `authority-mongo` | `authority.user.*`, `authority.token.refreshed` | `user.profile.created` |
| slim-shady | HTTP + NATS | `slim-shady-mongo` | `user.profile.*` | `authority.user.signed_up` |
| soundgarden | HTTP + NATS | `soundgarden-minio` | `track.upload.*`, `track.uploaded`, `track.upload.failed` | none |
| petrified | HTTP health + NATS | `petrified-redis`, `petrified-minio` | `track.petrified.*`, `track.duplicate.detected` | `track.uploaded` |
| fort-minor | HTTP health + NATS | `fort-minor-redis`, `fort-minor-minio` | `track.fort-minor.*` | `track.petrified.generated` |
| stereo | HTTP health + NATS | `stereo-mongo` | `track.stereo.*`, `track.approved`, `track.rejected` | `track.petrified.generated`, `track.fort-minor.completed` |
| mockingbird | HTTP health + NATS | `mockingbird-minio` | `track.transcoding.*`, `track.hls.generated` | `track.approved` |
| hybrid-storage | HTTP health + NATS | `hybrid-storage-minio` | `track.hls.stored`, `track.hls.failed` | `track.hls.generated` |
| backstage | HTTP + Socket.IO + NATS | `backstage-mongo` | websocket `pipeline.event` | `track.*` |
| pulse | HTTP + Socket.IO client | none | none | service HTTP APIs + websocket stream |

## Notes

- `shinod-ai` is removed; the AI pipeline now deploys as `petrified`, `fort-minor`, and `stereo`.
- No Mongo, Redis, or MinIO instance is shared across microservices.
- Backstage remains projection-only and should not own workflow decisions.
