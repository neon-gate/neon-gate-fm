import { DomainEvent } from '@pack/kernel'

import { UserEvent } from '@pack/event-inventory'

export interface UserProfileUpdatedPayload {
  profileId: string
  fields: string[]
}

export class UserProfileUpdatedEvent extends DomainEvent<UserProfileUpdatedPayload> {
  constructor(
    aggregateId: string,
    props: UserProfileUpdatedPayload,
    meta: { eventId: string; occurredOn: Date }
  ) {
    super(aggregateId, props, meta)
  }

  get eventName(): string {
    return UserEvent.ProfileUpdated
  }

  get eventVersion(): number {
    return 1
  }
}
