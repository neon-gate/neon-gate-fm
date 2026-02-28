export class Either<L, R> {
  private constructor(
    private readonly leftValue?: L,
    private readonly rightValue?: R
  ) {}

  static left<L, R>(value: L): Either<L, R> {
    return new Either(value, undefined) as Either<L, R>
  }

  static right<L, R>(value: R): Either<L, R> {
    return new Either(undefined, value) as Either<L, R>
  }

  isLeft(): boolean {
    return this.leftValue !== undefined
  }

  isRight(): boolean {
    return this.rightValue !== undefined
  }

  get left(): L {
    return this.leftValue as L
  }

  get right(): R {
    return this.rightValue as R
  }
}
