# @pack/environment

## Purpose

Fail-fast environment helpers for backend services.

> See [GENERAL_CODE_GUIDELINE.md](../../../.agents/rules/GENERAL_CODE_GUIDELINE.md) and its "Never Default Environment Variables" rule.

## API

| Helper | Behavior |
| --- | --- |
| `requireStringEnv(name)` | Throws if the variable is missing or empty |
| `requireNumberEnv(name)` | Throws if missing or not a finite number |
| `optionalStringEnv(name, defaultValue)` | Returns the env value or the provided default |
| `optionalNumberEnv(name, defaultValue)` | Returns the env value or default, but still validates numeric input |

## Usage

```ts
import { requireNumberEnv, requireStringEnv } from '@pack/environment'

const port = requireNumberEnv('PORT')
const mongoUri = requireStringEnv('MONGO_URI')
```
