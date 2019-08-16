import { Process } from "./process";
import { Directory } from "../util/directory";

export interface Command {
  readonly name?: string;
  execute(rows: number, args: Directory<string>): Process;
}
