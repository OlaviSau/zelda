import {IPty} from "node-pty";

export interface Config {
  projects: Project[];
  paths: Paths;
}

export interface Paths {
  cmd: string;
  node: string;
  npm: string;
}


export interface Project {
  defaultApplication: string;
  id: number;
  name: string;
  type: ProjectType;
  directory: string;
  dependencies: Dependency[];
}

export enum ProjectType {
  Angular = "Angular"
}

export interface LernaConfig {
  packages: string[];
}

export interface AngularProjectConfig {
  projects: {
    [key: string]: any
  };
  defaultProject?: string;
}

export interface Dependency {
  directory: string;
  name: string;
  type: DependencyType;
}

export interface PackageConfig {
  name: string;
}

export interface Process {
  pty: IPty;
  buffer: string[];
  name: string;
}

export enum DependencyType {
  Package = "Package",
  Lerna = "Lerna"
}
