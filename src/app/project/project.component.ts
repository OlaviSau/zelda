import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { lstat, readFile } from "fs";
import { AngularProjectConfig, Dependency, DependencyType, ProjectType } from "../app.model";
import { LernaService } from "../lerna/lerna.service";
import { stripComments } from "tslint/lib/utils";
import { ConfigService } from "../config/config.service";
import { MatSnackBar } from "@angular/material";
import { combineLatest, Observable } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { Project } from "./project";
import { NPM } from "../npm/npm";
import { ProcessState } from "../process/process.state";

enum LinkedStatus {
  Linked = "Linked",
  NotLinked = "NotLinked"
}

@Component({
  selector: "app-project",
  styleUrls: ["./project.component.scss"],
  templateUrl: "./project.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectComponent implements OnInit {

  constructor(
    private changeDetector: ChangeDetectorRef,
    public lernaService: LernaService,
    private config: ConfigService,
    private snackBar: MatSnackBar,
    private processState: ProcessState
  ) {
  }

  project: Project;
  configuring = false;
  moduleWatchers$ = {};
  lernaPackagesByStatus$ = {
    [LinkedStatus.Linked]: {},
    [LinkedStatus.NotLinked]: {}
  };
  readonly DependencyType = DependencyType;
  readonly ProjectType = ProjectType;
  readonly LinkedStatus = LinkedStatus;
  public npm: NPM;


  applications: string[] = [];
  selectedApplication: string;
  @Input() projectIndex: number;
  @ViewChild("projectConfiguring", {static: false}) projectConfiguring;

  ngOnInit() {
    this.project = new Project(this.config.projects[this.projectIndex]);
    this.npm = new NPM(this.config.paths, this.project);
    if (this.project.type === ProjectType.Angular) {
      readFile(`${this.project.directory}/angular.json`, {encoding: "utf8"}, (err, data) => {
        if (err) {
          return this.snackBar.open(`angular.json could not be found`, "Dismiss");
        }
        const angularProjectConfig: AngularProjectConfig = JSON.parse(stripComments(data));
        this.applications = Object.keys(angularProjectConfig.projects);


        const [defaultProject] = this.applications;

        if (angularProjectConfig.defaultProject) {
          this.selectedApplication = angularProjectConfig.defaultProject;
        } else {
          this.selectedApplication = defaultProject;
        }
      });
    } else if (!this.project.type) {
      this.configuring = true;
    }
  }

  filterLernaPackagesByStatus$(dependency, status: LinkedStatus): Observable<Dependency[]> {
    if (!this.lernaPackagesByStatus$[status][dependency.directory]) {
      const lernaPackages = this.lernaService.packages[dependency.directory];
      this.lernaPackagesByStatus$[status][dependency.directory] = combineLatest(
        lernaPackages.map(p => this.isLinked$(p))
      ).pipe(
        map(result => lernaPackages.filter((item, index) => result[index] === status))
      );
    }
    return this.lernaPackagesByStatus$[status][dependency.directory];
  }

  isLinked$(link) {
    if (!this.moduleWatchers$[link.name]) {
      this.moduleWatchers$[link.name] = this.project.dependencyChange$.pipe(
        switchMap(() => new Promise(resolve => lstat(`${this.project.directory}/node_modules/${link.name}`,
          (err, stats) =>  resolve(err ? false : stats.isSymbolicLink())
        ))),
        map(status => status ? LinkedStatus.Linked : LinkedStatus.NotLinked),
        tap(() => this.changeDetector.detectChanges())
      );
    }
    return this.moduleWatchers$[link.name];
  }
}
