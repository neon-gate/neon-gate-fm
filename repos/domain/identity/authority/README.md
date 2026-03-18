# Authority

## Overview

Authentication and session authority for Pulse.

## Architecture

Layers: `application`, `domain`, `infra`, `interface`.

## Transport

| Surface | Contract |
| --- | --- |
| HTTP | auth flows and `/authority/me` |
| NATS emits | `authority.user.signed_up`, `authority.user.logged_in`, `authority.token.refreshed`, `authority.user.logged_out` |
| NATS consumes | `user.profile.created` |

## Infrastructure

Owns `authority-mongo`.

## Environment

See [.env.template](/home/jonatas/code/pulse/repos/domain/identity/authority/.env.template).

## Development

`pnpm --filter @micro/authority dev`
