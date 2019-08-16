import { ReplaySubject } from "rxjs";
import { Process } from "./process";
import { Directory } from "../util/directory";

export class ConcurrentProcess implements Process {
  private completedCount = 0;
  constructor(private commands: Process[], readonly name?: string) {}
  readonly buffer$ = new ReplaySubject<string>();

  execute(rows: number, args: Directory<string>) {
    for (const command of this.commands) {
      command.execute(rows, args);
      command.buffer$.subscribe({
        next: chunk => this.buffer$.next(chunk),
        error: err => this.buffer$.error(err),
        complete: () => this.completedCount === this.commands.length ? this.buffer$.complete() : null
      });
    }
  }

  kill() {
    for (const command of this.commands) {
      command.kill();
    }
  }
}
