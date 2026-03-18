import { DomainEntity } from './domain-entity.abstract'
import { DomainEvent } from './domain-event.abstract'
import { Id } from './id.abstract'

/**
 * Base class for aggregate roots that track domain events and expose them via pullEvents.
 *
 * @param props - Aggregate properties
 * @param id - Unique identifier for the aggregate
 * @example
 * class Order extends AggregateRoot<OrderProps> {
 *   static create(props: OrderProps) {
 *     const order = new Order(props, new OrderId(crypto.randomUUID()))
 *     order.record(new OrderCreated(order.id.value, props))
 *     return order
 *   }
 * }
 */
export abstract class AggregateRoot<Props> extends DomainEntity<Props> {
  private readonly pendingEvents: DomainEvent<any>[] = []

  protected constructor(props: Props, id: Id) {
    super(props, id)
  }

  /**
   * Records a domain event to be published when the aggregate is persisted.
   *
   * @param event - The domain event to record
   * @example
   * this.record(new OrderShipped(this.id.value, { carrier: 'UPS' }))
   */
  protected record(event: DomainEvent<any>): void {
    this.pendingEvents.push(event)
  }

  /**
   * Returns and clears all pending domain events.
   *
   * @returns Array of recorded events for publishing
   * @example
   * const events = aggregate.pullEvents()
   * await eventBus.publish(...events)
   */
  pullEvents(): DomainEvent<any>[] {
    const events = [...this.pendingEvents]
    this.pendingEvents.length = 0
    return events
  }
}
