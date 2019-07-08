export enum DependencyType {
  Package = "Package",
  Lerna = "Lerna"
}

export interface Dependency {
  directory: string;
  name: string;
  type: DependencyType;
}
