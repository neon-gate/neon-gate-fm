# Stereo

## Overview

Reasoning and approval worker for the AI pipeline.

## Architecture

Layers: `application`, `domain`, `infra`, `interface`.

## Transport

| Surface | Contract |
| --- | --- |
| HTTP | `/health` |
| NATS emits | `track.stereo.started`, `track.approved`, `track.rejected`, `track.stereo.failed` |
| NATS consumes | `track.petrified.generated`, `track.fort-minor.completed` |

## Infrastructure

Owns `stereo-mongo`.

## Environment

See [.env.template](/home/jonatas/code/pulse/repos/domain/ai/stereo/.env.template).

## Development

`pnpm --filter @micro/stereo dev`
