import { DomainEvent } from '@pack/kernel'

import { AuthorityEvent } from '@pack/event-inventory'

export interface UserLoggedOutPayload {
  userId: string
  sessionId: string
}

export class UserLoggedOutEvent extends DomainEvent<UserLoggedOutPayload> {
  constructor(
    aggregateId: string,
    props: UserLoggedOutPayload,
    meta: { eventId: string; occurredOn: Date }
  ) {
    super(aggregateId, props, meta)
  }

  get eventName() {
    return AuthorityEvent.UserLoggedOut
  }

  get eventVersion() {
    return 1
  }
}
