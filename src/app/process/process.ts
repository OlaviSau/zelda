import { Observable } from "rxjs";
import { Directory } from "../util/directory";

export interface Process {
  name?: string;
  readonly buffer$: Observable<string>;
  execute(rows: number, args: Directory<string>): void;
  kill(): void;
}
