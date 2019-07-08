import { Observable, OperatorFunction } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";

export function select<T, R>(project: (state: T) => R): OperatorFunction<T, R> {
  return (source: Observable<T>) => source.pipe(map(project), distinctUntilChanged());
}
