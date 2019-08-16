import { ReplaySubject } from "rxjs";
import { Process } from "./process";

type ProcessFactory = () => Process;

export class SequentialProcess extends ReplaySubject<string> implements Process {
  private killed = false;
  private currentHandle: Process | undefined;

  constructor(factories: ProcessFactory[], readonly name = "") {
    super();
    this.execute(factories);
  }

  private execute(factories: ProcessFactory[]) {
    const [factory, ...nextFactories] = factories;
    if (factory === undefined) {
      return this.complete();
    }
    this.currentHandle = factory();
    this.currentHandle.subscribe({
      next: chunk => this.next(chunk),
      error: err =>  this.error(err),
      complete: () => this.killed ? undefined : this.execute(nextFactories)
    });
  }

  kill() {
    this.killed = true;
    this.complete();
    if (this.currentHandle) {
      this.currentHandle.kill();
    }
  }
}
