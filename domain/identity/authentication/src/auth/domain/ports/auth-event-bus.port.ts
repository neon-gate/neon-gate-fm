import type { EventBus } from '@repo/event-bus'

import type { AuthEventMap } from '@domain/events'

export const AuthEventBusPort = Symbol('AuthEventBusPort')

export type AuthEventBus = EventBus<AuthEventMap>
