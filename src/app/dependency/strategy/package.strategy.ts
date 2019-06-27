import { Dependency } from "../../app.model";
import { PackageDependency } from "../package-dependency";

export function packageStrategy(dependency: Dependency): Dependency {
  return new PackageDependency(dependency);
}
