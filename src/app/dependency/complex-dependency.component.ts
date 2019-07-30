import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from "@angular/core";
import { combineLatest, ReplaySubject } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { ProjectWatcher } from "../project/project-watcher";
import { Dependency, DependencyType } from "./dependency";
import glob from "../util/async/glob";
import exists from "../util/async/exists";
import { JsonFile } from "../file/json.file";
import { MatSnackBar } from "@angular/material";
import { ProjectState } from "../project/project.state";
import { ignoreNil } from "../util/ignore-nil";
import { AsyncArray } from "@bunne/async-array";

@Component({
  selector: "lx-complex-dependency",
  templateUrl: "./complex-dependency.component.html",
  styleUrls: ["./complex-dependency.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplexDependencyComponent {
  @HostBinding("class.closed") closed = true;

  @Input() set dependency(dependency: Dependency) {
    this.dependency$.next(dependency);
  }

  constructor(
    public projectState: ProjectState,
    private watcher: ProjectWatcher,
    private snack: MatSnackBar
  ) {
  }

  dependency$ = new ReplaySubject<Dependency>();
  dependenciesWithStatus$ = combineLatest([
    this.dependency$.pipe(switchMap(dependency => this.resolve$(dependency))),
    this.projectState.selected$.pipe(ignoreNil())
  ]).pipe(
    switchMap(([dependencies, project]) =>
      combineLatest(dependencies.map(dependency => this.watcher.isLinked$(project, dependency)))
    )
  );

  linkedDependencies$ = this.dependenciesWithStatus$.pipe(
    map(dependencies => dependencies.filter(dependency => dependency.linked))
  );
  notLinkedDependencies$ = this.dependenciesWithStatus$.pipe(
    map(dependencies => dependencies.filter(dependency => !dependency.linked))
  );

  private async resolve$(dependency: Dependency): Promise<Dependency[]> {
    if (dependency.type === DependencyType.Lerna) {
      return new AsyncArray(
        JsonFile.read<{ packages: string[] }>(`${dependency.directory}/lerna.json`)
          .then(config => config.packages)
      ).reduce(
        (dependencies, pattern) =>
          new AsyncArray(glob(`${dependency.directory}/${pattern}`))
            .filter(directory => exists(`${directory}/package.json`))
            .map(directory => JsonFile.read<{ name: string }>(`${directory}/package.json`)
              .then(({name}) => ({
                name,
                directory,
                type: DependencyType.Package
              }))
            ).concat(dependencies), new AsyncArray()
      );
    } else {
      this.snack.open(`${dependency.name} is of unknown type`, "Dismiss");
    }

    return [];
  }
}
