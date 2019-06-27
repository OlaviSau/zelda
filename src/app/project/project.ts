import { Dependency, ProjectConfig, ProjectType } from "../app.model";
import { Observable } from "rxjs";
import { watch } from "fs";
import { shareReplay } from "rxjs/operators";
import { dependencyFactory } from "../dependency/dependency.factory";

export class Project implements ProjectConfig {
  readonly dependencies: Dependency[];
  readonly directory: string;
  readonly type: ProjectType | null;
  readonly name: string;

  public dependencyChange$ = new Observable(self => {
    const watcher = watch(
      this.directory,
      { recursive: true },
      (event, filename) => filename && filename.includes("node_modules") ? self.next(event) : null
    );
    self.next("initialize");
    return () => watcher.close();
  }).pipe(shareReplay());

  constructor({dependencies, directory, type, name}: ProjectConfig) {
    this.dependencies = dependencies.map(dependencyFactory);
    this.directory = directory;
    this.type = type;
    this.name = name;
  }

}
