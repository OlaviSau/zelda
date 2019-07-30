export class AsyncArray<T> implements Promise<T[]> {
  constructor(private array: Promise<T[]> = Promise.resolve([])) {
  }

  readonly [Symbol.toStringTag]: string;

  filter(predicate: (item: T, index: number, thisArg?: any) => Promise<boolean>, thisArg?: any): AsyncArray<T> {
    return new AsyncArray(
      this.array.then(
        array => Promise.all(
          array.map((item, index) => predicate(item, index, thisArg))
        ).then(
          filter => array.filter((item, index) => filter[index])
        )
      )
    );
  }

  map<R>(mapper: (item: T, index: number, thisArg?: any) => Promise<R>, thisArg?: any): AsyncArray<R> {
    return new AsyncArray(
      this.array.then(
        array => Promise.all(
          array.map((item, index) => mapper(item, index, thisArg))
        )
      )
    );
  }

  concat(...arrays: (Promise<T[]>)[]): AsyncArray<T> {
    return new AsyncArray(
      this.array.then(
        array => Promise.all(arrays).then(arraysToConcat => array.concat(...arraysToConcat))
      )
    );
  }

  async reduce<R>(accumulator: (value: Promise<R>, item: T) => Promise<R>, value: Promise<R>): Promise<R> {
    for (const item of await this.array) {
      value = accumulator(value, item);
    }
    return value;
  }

  catch<TResult = never>(onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | undefined | null): Promise<T[] | TResult> {
    return this.array.catch.call(this.array, onrejected);
  }

  finally(onfinally?: (() => void) | undefined | null): Promise<T[]> {
    return this.array.finally.call(this.array, onfinally);
  }

  then<TResult1 = T[], TResult2 = never>(
    onfulfilled?: ((value: T[]) => (PromiseLike<TResult1> | TResult1)) | undefined | null,
    onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null
  ): Promise<TResult1 | TResult2> {
    return this.array.then.call(this.array, onfulfilled, onrejected);
  }
}
