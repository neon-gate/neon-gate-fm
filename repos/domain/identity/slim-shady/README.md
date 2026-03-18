# Slim Shady

## Overview

User-profile bounded context for Pulse.

## Architecture

Layers: `application`, `domain`, `infra`, `interface`.

## Transport

| Surface | Contract |
| --- | --- |
| HTTP | profile APIs and `/health` |
| NATS emits | `user.profile.created`, `user.profile.updated`, `user.profile.deleted` |
| NATS consumes | `authority.user.signed_up` |

## Infrastructure

Owns `slim-shady-mongo`.

## Environment

See [.env.template](/home/jonatas/code/pulse/repos/domain/identity/slim-shady/.env.template).

## Development

`pnpm --filter @micro/slim-shady dev`
