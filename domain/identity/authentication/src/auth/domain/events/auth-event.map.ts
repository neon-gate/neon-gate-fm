import type { EventMap } from '@repo/event-bus'

import { AuthProvider } from '@domain/value-objects'

export type AuthEventMap = EventMap & {
  'auth.user.signed_up': {
    userId: string
    email: string
    provider: AuthProvider
    name?: string | null
    occurredAt: string
  }
  'auth.user.logged_in': {
    userId: string
    email: string
    provider: AuthProvider
    sessionId: string
    ipAddress?: string | null
    userAgent?: string | null
    occurredAt: string
  }
  'auth.token.refreshed': {
    userId: string
    sessionId: string
    occurredAt: string
  }
  'auth.user.logged_out': {
    userId: string
    sessionId: string
    occurredAt: string
  }
}
