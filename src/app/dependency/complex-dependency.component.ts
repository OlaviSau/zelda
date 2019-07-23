import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, ViewEncapsulation } from "@angular/core";
import { combineLatest, EMPTY, ReplaySubject } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { ProjectWatcher } from "../project/project-watcher";
import { Dependency, DependencyType } from "./dependency";
import { existsSync, readFileSync, statSync } from "fs";
import { sync } from "glob";
import { JsonFile } from "../file/json.file";
import { MatSnackBar } from "@angular/material";
import { ProjectState } from "../project/project.state";

interface LernaConfig {
  packages: string[];
}
interface PackageConfig {
  name: string;
}

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
    private snack: MatSnackBar,
    private changeDetector: ChangeDetectorRef) {}

  dependency$ = new ReplaySubject<Dependency>();
  linkedDependencies$ = this.filterByStatus$(true);
  notLinkedDependencies$ = this.filterByStatus$(false);

  private filterByStatus$(status: boolean) {
    return combineLatest([
      this.dependency$.pipe(
        switchMap(dependency => this.resolveDependencies$(dependency))
      ), this.projectState.selected$
    ]).pipe(
      switchMap(([dependencies, project]) => project ? combineLatest(
        dependencies.map(dep => this.watcher.isLinked$(project, dep))
      ).pipe(
        map(isLinked => {
          this.changeDetector.markForCheck();
          return dependencies.filter((_, index) => isLinked[index] === status);
        }),
      ) : EMPTY )
    );
  }

  private resolveDependencies$(dependency: Dependency): Promise<Dependency[]> {
    if (dependency.type === DependencyType.Lerna) {
      return new Promise(resolve => {
        try {
          const lernaJSON = new JsonFile<LernaConfig>(`${dependency.directory}/lerna.json`);
          lernaJSON.read().then(
            lernaConfig => {
              const dependencies = lernaConfig.packages.reduce(
                (deps, glob) => deps.concat(
                  sync(`${dependency.directory}/${glob}`)
                    .filter(path => statSync(path).isDirectory() && existsSync(`${path}/package.json`))
                    .map(directory => {
                      const {name}: PackageConfig = JSON.parse(readFileSync(`${directory}/package.json`, {encoding: "utf8"}));
                      return {
                        name,
                        directory,
                        type: DependencyType.Package
                      };
                    })
                ), [] as Dependency[]
              );
              resolve(dependencies);
            }
          );
        } catch (err) {
          resolve([]);
        }
      });
    }
    this.snack.open(`${dependency.name} is of unknown type`, "Dismiss");
    return Promise.resolve([]);
  }
}
