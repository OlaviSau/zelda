import { MonoTypeOperatorFunction, Observable, OperatorFunction } from "rxjs";
import { filter } from "rxjs/operators";

export function ignoreNil<T>(): OperatorFunction<T, NonNullable<T>> {
  return (source: Observable<T>) => source.pipe(filter((value): value is NonNullable<T> => value !== null && value !== undefined));
}
