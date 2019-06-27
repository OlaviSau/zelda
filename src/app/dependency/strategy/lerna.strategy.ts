import { existsSync, readFileSync, statSync } from "fs";
import { sync } from "glob";
import { PackageDependency } from "../package-dependency";
import { Dependency } from "../../app.model";
import { ComplexDependency } from "../complex-dependency";

interface LernaConfig {
  packages: string[];
}
interface PackageConfig {
  name: string;
}

export function lernaStrategy(dependency: Dependency): Dependency {
  const lernaConfig: LernaConfig = JSON.parse(readFileSync(`${dependency.directory}/lerna.json`, {encoding: "utf8"}));
  const dependencies = lernaConfig.packages.reduce(
    (deps, glob) => deps.concat(
      sync(`${dependency.directory}/${glob}`)
        .filter(path => statSync(path).isDirectory() && existsSync(`${path}/package.json`))
        .map(directory => {
          const {name}: PackageConfig = JSON.parse(readFileSync(`${directory}/package.json`, {encoding: "utf8"}));
          return new PackageDependency({
            name,
            directory
          });
        })
    ), [] as PackageDependency[]
  );
  return new ComplexDependency(dependency, dependencies);
}
