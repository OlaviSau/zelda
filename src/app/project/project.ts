import { Dependency, ProjectConfig, ProjectType } from "../app.model";
import { Observable } from "rxjs";
import { watch } from "fs";

export class Project {
  readonly dependencies: Dependency[];
  readonly directory: string;
  readonly type: ProjectType;
  readonly name: string;

  public dependencyChange$ = new Observable(self => {
    const watcher = watch(
      this.directory,
      { recursive: true },
      (event, filename) => {
        console.log(event, filename);
        return filename && filename.includes("node_modules") ? self.next(event) : null;
      }
    );
    self.next("initialize");
    return () => watcher.close();
  });

  constructor({dependencies, directory, type, name}: ProjectConfig) {
    this.dependencies = dependencies;
    this.directory = directory;
    this.type = type;
    this.name = name;
  }

}
