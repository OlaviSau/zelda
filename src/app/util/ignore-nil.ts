import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

export function ignoreNil() {
  return <T>(source: Observable<T>) => source.pipe(filter((value): value is NonNullable<T> => value !== null && value !== undefined));
}
