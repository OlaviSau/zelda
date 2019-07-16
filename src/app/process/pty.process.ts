import { IPty, spawn } from "node-pty-prebuilt-multiarch";
import { ReplaySubject } from "rxjs";
import { Process } from "./process";
import { sync } from "which";

export class PtyProcess implements Process {
  constructor(cwd: string, command: string, readonly name?: string) {
    let isStringOpen = false;
    let isEscapeOpen = false;
    let currentSegment = "";
    const segments: string[] = [];

    for (let i = 0; i < command.length; i++) {
      const char = command.charAt(i);
      if (isEscapeOpen) {
        currentSegment += char;
        isEscapeOpen = false;
      } else if (char === "\\") {
        isEscapeOpen = true;
      } else if (char === "\"" || char === "'") {
        isStringOpen = !isStringOpen;
      } else if (isStringOpen) {
        currentSegment += char;
      } else if (char === " " && currentSegment) {
        segments.push(currentSegment);
        currentSegment = "";
      } else {
        currentSegment += char;
      }
    }

    segments.push(currentSegment);

    const [executable, ...args] = segments;
    this.name = name;
    this.handle = spawn(
      sync(executable),
      args,
      {
        cwd,
        cols: Math.floor(window.innerWidth / 7) - 1,
        rows: 30
      }
    );

    this.handle.on("data", data => this.buffer$.next(data));
    this.handle.on("exit", code => {
      if (code !== 0) {
        this.buffer$.error(code);
      }
      this.buffer$.complete();
    });
  }

  private handle: IPty;
  readonly buffer$ = new ReplaySubject<string>();

  kill() {
    this.handle.kill();
  }
}
