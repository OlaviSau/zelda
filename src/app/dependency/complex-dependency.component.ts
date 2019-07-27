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
    const dependencies: Dependency[] = [];
    if (dependency.type === DependencyType.Lerna) {
      const lernaConfig = await JsonFile.read<{ packages: string[] }>(`${dependency.directory}/lerna.json`);
      for (const pattern of lernaConfig.packages) {
        const directories = await glob(`${dependency.directory}/${pattern}`);
        for (const directory of directories) {
          if (await exists(`${directory}/package.json`)) {
            const {name} = await JsonFile.read<{ name: string }>(`${directory}/package.json`);
            dependencies.push({
              name,
              directory,
              type: DependencyType.Package
            });
          }
        }
      }
    } else {
      this.snack.open(`${dependency.name} is of unknown type`, "Dismiss");
    }

    return dependencies;
  }
}
