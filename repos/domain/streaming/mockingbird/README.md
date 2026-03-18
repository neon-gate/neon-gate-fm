# Mockingbird

## Overview

Transcoding worker that produces streaming artifacts.

## Architecture

Layers: `application`, `domain`, `infra`, `interface`.

## Transport

| Surface | Contract |
| --- | --- |
| HTTP | `/health` |
| NATS emits | `track.transcoding.started`, `track.transcoding.completed`, `track.transcoding.failed`, `track.hls.generated` |
| NATS consumes | `track.approved` |

## Infrastructure

Owns `mockingbird-minio`.

## Environment

See [.env.template](/home/jonatas/code/pulse/repos/domain/streaming/mockingbird/.env.template).

## Development

`pnpm --filter @micro/mockingbird dev`
