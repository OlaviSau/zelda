import { Dependency, DependencyType } from "../app.model";
import { lernaStrategy } from "./strategy/lerna.strategy";
import { packageStrategy } from "./strategy/package.strategy";

export function dependencyFactory(dependency: Dependency) {
  return {
    [DependencyType.Lerna]: lernaStrategy,
    [DependencyType.Package]: packageStrategy
  }[dependency.type](dependency);
}
