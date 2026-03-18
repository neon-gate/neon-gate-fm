export const platformArchitectureInstruction = `## Platform Architecture

Pulse is an event-driven music streaming platform composed of these microservices:

| Service | Port | Responsibility |
|---------|------|----------------|
| Authority | 7000 | Authentication, sessions, JWT tokens |
| Slim Shady | 7400 | User profiles, onboarding |
| Soundgarden | 7100 | Track upload, file validation, object storage |
| Petrified | 7201 | Acoustic fingerprinting via Chromaprint/fpcalc |
| Fort Minor | 7202 | Audio transcription via Whisper (AI SDK) |
| Stereo | 7203 | AI reasoning — approve or reject tracks |
| Mockingbird | 7201 | FFmpeg transcoding, HLS package generation |
| Hybrid Storage | 7300 | HLS persistence to MinIO |
| Backstage | 4001 | Pipeline event projection, WebSocket streaming |`
