import { Dependency } from "../dependency/dependency";

export interface Command {
  segments: string;
  icon: string;
  name: string;
  directory: string;
}

export interface Project {
  name: string;
  directory: string;
  dependencies: Dependency[];
  commands: Command[];
  terminal: {
    rows: number;
  };
}
