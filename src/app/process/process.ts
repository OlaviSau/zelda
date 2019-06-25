import { Observable } from "rxjs";

export interface Process {
  readonly name?: string;
  readonly buffer$: Observable<string>;
  kill(): void;
}
