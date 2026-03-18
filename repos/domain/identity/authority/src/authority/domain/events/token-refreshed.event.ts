import { DomainEvent } from '@pack/kernel'

import { AuthorityEvent } from '@pack/event-inventory'

export interface TokenRefreshedPayload {
  userId: string
  sessionId: string
}

export class TokenRefreshedEvent extends DomainEvent<TokenRefreshedPayload> {
  constructor(
    aggregateId: string,
    props: TokenRefreshedPayload,
    meta: { eventId: string; occurredOn: Date }
  ) {
    super(aggregateId, props, meta)
  }

  get eventName() {
    return AuthorityEvent.TokenRefreshed
  }

  get eventVersion() {
    return 1
  }
}
