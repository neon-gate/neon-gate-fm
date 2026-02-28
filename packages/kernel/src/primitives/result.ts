export class Result<T> {
  public readonly isSuccess: boolean
  public readonly isFailure: boolean
  private readonly _value?: T
  private readonly _error?: string

  private constructor(isSuccess: boolean, value?: T, error?: string) {
    this.isSuccess = isSuccess
    this.isFailure = !isSuccess
    this._value = value
    this._error = error
  }

  public static ok<T>(value?: T): Result<T> {
    return new Result<T>(true, value)
  }

  public static fail<T>(error: string): Result<T> {
    return new Result<T>(false, undefined, error)
  }

  get value(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get value of failed result.')
    }
    return this._value as T
  }

  get error(): string {
    return this._error as string
  }
}
