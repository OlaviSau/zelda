import { Dependency, DependencyType } from "../app.model";
import { Project } from "../project/project";
import { switchMap } from "rxjs/operators";
import { isLink } from "../util/is-link";

export class PackageDependency implements Dependency {
  readonly directory: string;
  readonly name: string;
  readonly type = DependencyType.Package;

  constructor(config: {directory: string, name: string}) {
    this.directory = config.directory;
    this.name = config.name;
  }

  isLinked$(project: Project) {
    return project.dependencyChange$.pipe(switchMap(() => isLink(`${project.directory}/node_modules/${this.name}`)));
  }
}
