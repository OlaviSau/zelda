import { ReplaySubject } from "rxjs";
import { Process } from "./process";

export class ConcurrentCommand implements Process {
  private completedCount = 0;
  constructor(private commands: Process[], readonly name?: string) {
    for (const command of commands) {
      command.buffer$.subscribe({
        next: chunk => this.buffer$.next(chunk),
        error: err => this.buffer$.error(err),
        complete: () => this.completedCount === commands.length ? this.buffer$.complete() : null
      });
    }
  }
  readonly buffer$ = new ReplaySubject<string>();

  kill() {
    for (const command of this.commands) {
      command.kill();
    }
  }
}
