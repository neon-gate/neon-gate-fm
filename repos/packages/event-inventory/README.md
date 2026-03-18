# @pack/event-inventory

## Purpose

Single source of truth for Pulse NATS subjects.

## Naming

- lowercase
- dot-delimited
- domain-first subjects such as `track.uploaded`

## Catalog

| Subject Group | Producer | Consumers |
| --- | --- | --- |
| `authority.user.*`, `authority.token.refreshed` | authority | slim-shady, observability |
| `user.profile.*` | slim-shady | authority, observability |
| `track.upload.*`, `track.uploaded`, `track.upload.failed` | soundgarden | petrified, backstage |
| `track.petrified.*`, `track.duplicate.detected` | petrified | fort-minor, stereo, backstage |
| `track.fort-minor.*` | fort-minor | stereo, backstage |
| `track.stereo.*`, `track.approved`, `track.rejected` | stereo | mockingbird, backstage |
| `track.transcoding.*`, `track.hls.generated` | mockingbird | hybrid-storage, backstage |
| `track.hls.stored`, `track.hls.failed` | hybrid-storage | backstage |

## Adding Events

1. Add the subject to the appropriate enum.
2. Update producer and consumer documentation.
3. Keep emitted payloads backward compatible or version them explicitly.
