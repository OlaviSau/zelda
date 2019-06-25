import { IPty, spawn } from "node-pty-prebuilt-multiarch";
import { ReplaySubject } from "rxjs";
import { Process } from "./process";

export class Command implements Process {
  constructor(cwd: string, segments: string[], readonly name?: string) {
    const [executable, ...args] = segments;
    this.name = name;
    this.handle = spawn(
      executable,
      args,
      {cwd, cols: Math.floor(window.innerWidth / 7)}
    );

    this.handle.on("data", data => this.buffer$.next(data));
    this.handle.on("exit", code => {
      if (code !== 0) {
        this.buffer$.error(code);
      }
      this.buffer$.next(`Process exited with code: ${code}`);
      this.buffer$.complete();
    });
  }

  private handle: IPty;
  readonly buffer$ = new ReplaySubject<string>();

  kill() {
    this.handle.kill();
  }
}
