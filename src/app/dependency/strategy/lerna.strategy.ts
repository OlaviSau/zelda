import { existsSync, readFileSync, statSync } from "fs";
import { sync } from "glob";
import { PackageDependency } from "../package-dependency";

interface LernaConfig {
  packages: string[];
}
interface PackageConfig {
  name: string;
}

export function lernaStrategy(directory: string): PackageDependency[] {
  const lernaConfig: LernaConfig = JSON.parse(readFileSync(`${directory}/lerna.json`, {encoding: "utf8"}));
  return  lernaConfig.packages.reduce(
    (dependencies, glob) => dependencies.concat(
      sync(`${directory}/${glob}`)
        .filter(path => statSync(path).isDirectory() && existsSync(`${path}/package.json`))
        .map(packageDirectory => {
          const {name}: PackageConfig = JSON.parse(readFileSync(`${packageDirectory}/package.json`, {encoding: "utf8"}));
          return new PackageDependency({
            name,
            directory: packageDirectory
          });
        })
    ), [] as PackageDependency[]
  );

}
