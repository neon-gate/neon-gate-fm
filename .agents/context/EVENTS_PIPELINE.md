# Pulse Event Pipeline Context

## End-to-End Flow

1. Soundgarden emits upload lifecycle events.
2. Petrified fingerprints the uploaded track.
3. Fort Minor transcribes the track.
4. Stereo aggregates signals and approves or rejects.
5. Mockingbird transcodes approved tracks.
6. Hybrid Storage persists the HLS package.
7. Backstage observes the full flow.

## Subjects

| Subject | Producer | Consumers |
| --- | --- | --- |
| `authority.user.signed_up` | authority | slim-shady |
| `user.profile.created` | slim-shady | authority |
| `track.uploaded` | soundgarden | petrified, backstage |
| `track.petrified.generated` | petrified | fort-minor, stereo, backstage |
| `track.fort-minor.completed` | fort-minor | stereo, backstage |
| `track.approved` | stereo | mockingbird, backstage |
| `track.hls.generated` | mockingbird | hybrid-storage, backstage |
| `track.hls.stored` | hybrid-storage | backstage |

## Notes

- The old `shinod-ai` monolith is split into `petrified`, `fort-minor`, and `stereo`.
- Backstage remains an observer and read-model service.
- Subject names stay stable across the refactor.
