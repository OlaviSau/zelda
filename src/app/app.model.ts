import {IPty} from "node-pty";

export interface Project {
  defaultApplication: string;
  name: string;
  directory: string;
  dependencies: {
    scope: string,
    directory: string,
    name: string
  }[];
}

export interface Process {
  pty: IPty;
  buffer: string[];
  name: string;
  status: ProcessStatus;
}

export enum ProcessStatus {
  Active = "Active",
  Suspended = "Suspended",
  Killed = "Killed"
}
