export class UniqueEntityId {
  private readonly _value: string

  constructor(value?: string) {
    this._value = value ?? crypto.randomUUID()
  }

  toString(): string {
    return this._value
  }

  equals(id: UniqueEntityId): boolean {
    return this._value === id.toString()
  }
}
