import type { ObjectPrimitive } from '../types'
import { DomainEvent } from '../primitives/domain-event.abstract'

/**
 * Base class for domain event handlers.
 *
 * @example
 * class OrderCreatedHandler extends EventHandler<'Order', OrderPayload, OrderCreated> {
 *   readonly eventName = 'Order'
 *   async handle(event: OrderCreated) {
 *     await this.projector.project(event)
 *   }
 * }
 */
export abstract class EventHandler<
  Domain,
  Props extends ObjectPrimitive<Domain>,
  Event extends DomainEvent<Props, Domain>
> {
  /** Domain event name this handler handles. */
  abstract readonly eventName: Domain

  /**
   * Handles the event.
   *
   * @param event - The domain event to handle
   * @returns Promise that resolves when handling is complete
   */
  abstract handle(event: Event): Promise<void>
}
