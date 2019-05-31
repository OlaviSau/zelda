import { IPty } from "node-pty";
import { ChildProcess } from "child_process";

type ProcessFactory = () => IPty | ChildProcess;

export function execSequential(command?: ProcessFactory, ...nextCommands: ProcessFactory[]) {
  if (typeof command === "function") {
    command().on("exit", exitCode => exitCode === 0 ? execSequential(...nextCommands) : null);
  }
}
