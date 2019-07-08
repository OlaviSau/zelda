import { Process } from "./process";
import { PtyProcess } from "./pty.process";
import { ReplaySubject } from "rxjs";

export type ProcessFactory = () => PtyProcess;

export class SequentialProcess implements Process {
  constructor(private factories: ProcessFactory[], readonly name?: string) {
    this.nextCommand();
  }

  private currentHandle: Process | undefined;
  readonly buffer$ = new ReplaySubject<string>();

  private nextCommand() {
    const [factory, ...nextFactories] = this.factories;
    this.factories = nextFactories;
    if (typeof factory !== "function") {
      return this.buffer$.complete();
    }
    this.currentHandle = factory();
    this.currentHandle.buffer$.subscribe({
      next: chunk => this.buffer$.next(chunk),
      error: err => {
        this.buffer$.error(err);
        this.factories = [];
      },
      complete: () => this.nextCommand()
    });
  }

  kill() {
    this.factories = [];
    if (this.currentHandle) {
      this.currentHandle.kill();
    }
  }
}
