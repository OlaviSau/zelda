import { Dependency, DependencyType } from "../app.model";
import { PackageDependency } from "./package-dependency";

export class ComplexDependency implements Dependency {
  directory: string;
  name: string;
  readonly dependencies: PackageDependency[] = [];
  readonly type = DependencyType.Lerna;

  constructor(dependency: {name: string, directory: string}, strategy: (directory: string) => PackageDependency[]) {
    this.directory = dependency.directory;
    this.name = dependency.name;
    this.dependencies = strategy(this.directory);
  }
}
