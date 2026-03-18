import { EventBus } from '@pack/nats-broker-messaging'

import type { StereoEventMap } from 'src/stereo/domain/events/stereo-event.map'

export abstract class StereoEventBusPort extends EventBus<StereoEventMap> {}
