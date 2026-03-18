# Hybrid Storage

## Overview

HLS persistence sink for transcoded track artifacts.

## Architecture

Layers: `application`, `domain`, `infra`, `interface`.

## Transport

| Surface | Contract |
| --- | --- |
| HTTP | `/health` |
| NATS emits | `track.hls.stored`, `track.hls.failed` |
| NATS consumes | `track.hls.generated` |

## Infrastructure

Owns `hybrid-storage-minio`.

## Environment

See [.env.template](/home/jonatas/code/pulse/repos/domain/streaming/hybrid-storage/.env.template).

## Development

`pnpm --filter @micro/hybrid-storage dev`
