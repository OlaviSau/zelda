import {IPty} from "node-pty";

export interface Config {
  projects: Project[];
  paths: {
    "cmd": string,
    "suspend": string,
    "node": string,
    "npm": string
  };
}

export interface Project {
  defaultApplication: string;
  name: string;
  directory: string;
  dependencies: Dependency[];
}

export interface LernaConfig {
  packages: string[];
}

export interface ProjectConfig {
  projects: {
    [key: string]: any
  };
  defaultProject?: string;
}

export interface Dependency {
  directory: string;
  name: string;
  type: DependencyType;
  scope?: string;
}

export interface PackageConfig {
  name: string;
}

export interface Process {
  pty: IPty;
  buffer: string[];
  name: string;
  status: ProcessStatus;
}

export enum DependencyType {
  Package = "Package",
  Lerna = "Lerna"
}

export enum ProcessStatus {
  Active = "Active",
  Suspended = "Suspended",
  Killed = "Killed"
}
