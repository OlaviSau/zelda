import { Dependency, DependencyType } from "../app.model";
import { lernaStrategy } from "./strategy/lerna.strategy";
import { DependencyStrategy } from "./dependency-strategy";
import { packageStrategy } from "./strategy/package.strategy";

const DependencyTypeToStrategy: {[key in DependencyType]: DependencyStrategy} = {
  [DependencyType.Lerna]: lernaStrategy,
  [DependencyType.Package]: packageStrategy
};

export function dependencyFactory(dependency: Dependency) {
  return DependencyTypeToStrategy[dependency.type](dependency);
}
