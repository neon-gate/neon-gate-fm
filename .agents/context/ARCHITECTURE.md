# Pulse Platform Architecture

## Monorepo Topology

```text
repos/apps/*        # frontend applications
repos/packages/*    # shared packages and orchestration assets
repos/domain/**     # deployable microservices
repos/agents/*      # agent runtimes
```

## Shared Packages

| Package | Purpose |
| --- | --- |
| `@pack/kernel` | domain and application primitives |
| `@pack/nats-broker-messaging` | NATS connection, consumer, and event-bus wiring |
| `@pack/environment` | fail-fast env helpers |
| `@pack/event-inventory` | platform event-subject enums |
| `@pack/patterns` | resilience primitives |
| `@pack/cache` | cache abstractions |
| `@pack/environment-orchestration` | Docker Compose topology |

## Runtime Services

| Service | Role | Owned Infra |
| --- | --- | --- |
| authority | authentication and sessions | `authority-mongo` |
| slim-shady | user profiles | `slim-shady-mongo` |
| soundgarden | upload ingress | `soundgarden-minio` |
| petrified | fingerprinting | `petrified-redis`, `petrified-minio` |
| fort-minor | transcription | `fort-minor-redis`, `fort-minor-minio` |
| stereo | reasoning and approval | `stereo-mongo` |
| mockingbird | transcoding | `mockingbird-minio` |
| hybrid-storage | HLS persistence | `hybrid-storage-minio` |
| backstage | realtime projection | `backstage-mongo` |
| pulse | frontend/BFF | none |

## Rules

- NATS stays shared.
- Mongo, Redis, and MinIO are owned per microservice.
- Shared packages expose abstractions and utilities, not cross-service runtime modules.
- `@pack/kernel` stays unchanged.
