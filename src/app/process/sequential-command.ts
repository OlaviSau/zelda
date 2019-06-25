import { Process } from "./process";
import { Command } from "./command";
import { ReplaySubject } from "rxjs";

type CommandFactory = () => Command;

export class SequentialCommand implements Process {
  constructor(private factories: CommandFactory[], readonly name?) {
    this.nextCommand();
  }

  private currentHandle: Process;
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
    this.currentHandle.kill();
  }
}
