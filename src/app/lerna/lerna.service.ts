import {Injectable} from "@angular/core";
import {Config, Dependency, DependencyType, LernaConfig, PackageConfig} from "../app.model";
import {existsSync, readFileSync, statSync} from "fs";
import {sync} from "glob";

@Injectable()
export class LernaService {
  packages: {
    [key: string]: Dependency[];
  } = {};

  addConfig(config: Config) {
    for (const project of config.projects) {
      for (const dependency of project.dependencies) {
        if (dependency.type === DependencyType.Lerna) {
          this.packages[dependency.name] = [];
          const lernaConfig: LernaConfig = JSON.parse(readFileSync(`${dependency.directory}/lerna.json`, {encoding: "utf8"}));
          for (const glob of lernaConfig.packages) {
            for (const path of sync(`${dependency.directory}/${glob}`)) {
              const stat = statSync(path);
              if (stat.isDirectory() && existsSync(`${path}/package.json`)) {
                const packageConfig: PackageConfig = JSON.parse(readFileSync(`${path}/package.json`, {encoding: "utf8"}));
                this.packages[dependency.name].push({
                  name: packageConfig.name,
                  directory: path,
                  type: DependencyType.Package
                });
              }
            }
          }
        }
      }
    }
  }
}
