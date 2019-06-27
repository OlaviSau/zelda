export interface Config {
  projects: ProjectConfig[];
  paths: Paths;
}

export interface Paths {
  cmd: string;
  node: string;
  npm: string;
}


export interface ProjectConfig {
  name: string;
  type: ProjectType | null;
  directory: string;
  dependencies: Dependency[];
}

export enum ProjectType {
  Angular = "Angular",
  Package = "Package"
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

export enum DependencyType {
  Package = "Package",
  Lerna = "Lerna"
}
