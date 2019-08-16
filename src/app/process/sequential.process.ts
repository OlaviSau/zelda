import { Process } from "./process";
import { ReplaySubject } from "rxjs";
import { Directory } from "../util/directory";

export class SequentialProcess implements Process {
  constructor(private processes: Process[], readonly name?: string) {}

  private currentHandle: Process | undefined;
  readonly buffer$ = new ReplaySubject<string>();

  private nextCommand(processes: Process[], rows: number, args: Directory<string>) {
    const [process, ...nextProcesses] = processes;
    if (process === undefined) {
      return this.buffer$.complete();
    }
    process.execute(rows, args);
    this.currentHandle = process;
    this.currentHandle.buffer$.subscribe({
      next: () => console.log("next"),
      error: () => console.log("error"),
      complete: () => console.log("complete")
    });
    this.currentHandle.buffer$.subscribe({
      next: chunk => this.buffer$.next(chunk),
      error: err =>  this.buffer$.error(err),
      complete: () => this.nextCommand(nextProcesses, rows, args)
    });
  }

  execute(rows: number, args: Directory<string>) {
    this.nextCommand(this.processes, rows, args);
  }

  kill() {
    if (this.currentHandle) {
      this.currentHandle.kill();
    }
  }
}
