import { Dependency } from "../dependency/dependency";

export enum ProjectType {
  Angular = "Angular",
  Package = "Package"
}

export interface Command {
  segments: [];
  tip: string;
  icon: string;
  name: string;
  directory: string;
}

export interface Project {
  name: string;
  type: ProjectType;
  directory: string;
  dependencies: Dependency[];
  commands: Command[];
}
