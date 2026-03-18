# Fort Minor

## Overview

Transcription worker for the AI pipeline.

## Architecture

Layers: `application`, `domain`, `infra`, `interface`.

## Transport

| Surface | Contract |
| --- | --- |
| HTTP | `/health` |
| NATS emits | `track.fort-minor.started`, `track.fort-minor.completed`, `track.fort-minor.failed` |
| NATS consumes | `track.petrified.generated` |

## Infrastructure

Owns `fort-minor-redis` and `fort-minor-minio`.

## Environment

See [.env.template](/home/jonatas/code/pulse/repos/domain/ai/fort-minor/.env.template).

## Development

`pnpm --filter @micro/fort-minor dev`
