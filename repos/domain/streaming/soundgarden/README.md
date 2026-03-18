# Soundgarden

## Overview

Upload and ingestion edge for the track pipeline.

## Architecture

Layers: `application`, `domain`, `infra`, `interface`.

## Transport

| Surface | Contract |
| --- | --- |
| HTTP | upload endpoint |
| NATS emits | `track.upload.received`, `track.upload.validated`, `track.upload.stored`, `track.uploaded`, `track.upload.failed` |
| NATS consumes | none |

## Infrastructure

Owns `soundgarden-minio`.

## Environment

See [.env.template](/home/jonatas/code/pulse/repos/domain/streaming/soundgarden/.env.template).

## Development

`pnpm --filter @micro/soundgarden dev`
