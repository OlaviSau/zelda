import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { watch } from "fs";
import { filter, map, shareReplay, startWith, switchMap } from "rxjs/operators";
import { Project } from "./project";
import { Dependency } from "../dependency/dependency";
import { isLink } from "../util/is-link";
import { join } from "path";

interface DependencyWithLinkedStatus extends Dependency {
  linked: boolean;
}

@Injectable({
  providedIn: "root"
}) export class ProjectWatcher {
  private watchers = new Map<Project, Observable<string>>();

  isLinked$(project: Project, dependency: Dependency): Observable<DependencyWithLinkedStatus> {
    let dependencyChange$ = this.watchers.get(project);

    if (!dependencyChange$) {
      dependencyChange$ = new Observable<string>(self => {
        const watcher = watch(
          project.directory,
          { recursive: true },
          (event, filename) => filename ? self.next(filename) : null
        );
        return () => watcher.close();
      }).pipe(shareReplay());
      this.watchers.set(project, dependencyChange$);
    }
    const dependencyPath = join("node_modules", dependency.name);
    const absoluteDependencyPath = join(project.directory, dependencyPath);

    return dependencyChange$.pipe(
      startWith(dependencyPath),
      filter(path => path === dependencyPath),
      switchMap(() => isLink(absoluteDependencyPath)),
      map(linked => ({
        ...dependency,
        linked
      }))
    );
  }
}
