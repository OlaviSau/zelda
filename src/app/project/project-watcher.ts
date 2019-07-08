import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { watch } from "fs";
import { shareReplay, switchMap } from "rxjs/operators";
import { Project } from "./project";
import { Dependency } from "../dependency/dependency";
import { isLink } from "../util/is-link";

@Injectable({
  providedIn: "root"
}) export class ProjectWatcher {
  private watchers = new Map<Project, Observable<string>>();

  isLinked$(project: Project, dependency: Dependency) {
    let dependencyChange$ = this.watchers.get(project);

    if (!dependencyChange$) {
      dependencyChange$ = new Observable<string>(self => {
        const watcher = watch(
          project.directory,
          { recursive: true },
          (event, filename) => filename && filename.includes("node_modules") ? self.next(event) : null
        );
        self.next("initialize");
        return () => watcher.close();
      }).pipe(
        shareReplay()
      );
      this.watchers.set(project, dependencyChange$);
    }
    return dependencyChange$.pipe(switchMap(() => isLink(`${project.directory}/node_modules/${dependency.name}`)));
  }
}
