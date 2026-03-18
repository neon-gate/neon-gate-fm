import { EventBus } from '@pack/nats-broker-messaging'

import type { FortMinorEventMap } from '@domain/events/fort-minor-event.map'

export abstract class FortMinorEventBusPort extends EventBus<FortMinorEventMap> {}
