import { Directory } from "../util/directory";
import { Command } from "./command";
import { SequentialProcess } from "./sequential.process";

export class SequentialCommand implements Command {
  constructor(private commands: Command[], readonly name?: string) {}

  execute(rows: number, args: Directory<string> = {}) {
    return new SequentialProcess(this.commands.map(command => () => command.execute(rows, args)), this.name);
  }
}
