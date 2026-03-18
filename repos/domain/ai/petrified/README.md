# Petrified

## Overview

Fingerprinting worker for the AI pipeline.

## Architecture

Layers: `application`, `domain`, `infra`, `interface`.

## Transport

| Surface | Contract |
| --- | --- |
| HTTP | `/health` |
| NATS emits | `track.petrified.generated`, `track.petrified.song.*`, `track.petrified.failed`, `track.duplicate.detected` |
| NATS consumes | `track.uploaded` |

## Infrastructure

Owns `petrified-redis` and `petrified-minio`.

## Environment

See [.env.template](/home/jonatas/code/pulse/repos/domain/ai/petrified/.env.template).

## Development

`pnpm --filter @micro/petrified dev`
