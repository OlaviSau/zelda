import { spawn } from "node-pty-prebuilt-multiarch";
import { sync } from "which";
import { Directory } from "../util/directory";
import { Command } from "./command";
import { PtyProcess } from "./pty.process";

export class PtyCommand implements Command {
  constructor(private cwd: string, private command: string, private name = "") {}

  execute(rows: number, replacements: Directory<string>) {
    let isStringOpen = false;
    let isEscapeOpen = false;
    let currentSegment = "";
    const segments: string[] = [];
    const command = this.command;
    const cwd = this.replace(this.cwd, replacements);

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

    const [executable, ...args] = segments.map(segment => this.replace(segment, replacements));

    return new PtyProcess(spawn(
      sync(executable),
      args,
      {
        cwd,
        cols: Math.floor(window.innerWidth / 7) - 1,
        rows
      }
    ), this.replace(this.name, replacements));
  }

  private replace(segment: string, replacements: Directory<string>) {
    for (const key in replacements) {
      segment = segment.replace(key, replacements[key]);
    }
    return segment;
  }

}
