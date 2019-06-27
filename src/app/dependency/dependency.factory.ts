import { Dependency, DependencyType } from "../app.model";
import { PackageDependency } from "./package-dependency";
import { ComplexDependency } from "./complex-dependency";
import { lernaStrategy } from "./strategy/lerna.strategy";
import { DependencyStrategy } from "./dependency-strategy";

const DependencyTypeToConstructor = {
  [DependencyType.Lerna]: ComplexDependency,
  [DependencyType.Package]: PackageDependency
};

const DependencyTypeToStrategy: {[key in DependencyType]: DependencyStrategy} = {
  [DependencyType.Lerna]: lernaStrategy,
  [DependencyType.Package]: () => []
};


export function dependencyFactory(dependency: Dependency) {
  const constructor = DependencyTypeToConstructor[dependency.type];
  const strategy = DependencyTypeToStrategy[dependency.type];
  return new constructor(dependency, strategy);
}
