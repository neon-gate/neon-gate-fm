# Backstage

## Overview

Realtime projection service for pipeline observability.

## Architecture

Layers: `application`, `domain`, `infra`, `interface`.

## Transport

| Surface | Contract |
| --- | --- |
| HTTP + Socket.IO | pipeline queries and live updates |
| NATS emits | websocket projection side effects only |
| NATS consumes | `track.*` |

## Infrastructure

Owns `backstage-mongo`.

## Environment

See [.env.template](/home/jonatas/code/pulse/repos/domain/realtime/backstage/.env.template).

## Development

`pnpm --filter @micro/backstage dev`
