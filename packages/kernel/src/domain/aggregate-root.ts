import { Entity } from './entity'
import { DomainEvent } from './domain-event'

export abstract class AggregateRoot<TProps> extends Entity<TProps> {
  private _domainEvents: DomainEvent[] = []

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event)
  }

  public pullDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents]
    this._domainEvents = []
    return events
  }
}
