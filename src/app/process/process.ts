import { Observable } from "rxjs";

export interface Process extends Observable<string> {
  readonly name?: string;
  kill(): void;
}
