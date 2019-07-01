import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { readFile } from "fs";
import { AngularProjectConfig, ProjectType } from "../app.model";
import { stripComments } from "tslint/lib/utils";
import { ConfigService } from "../config/config.service";
import { MatDialog, MatSnackBar } from "@angular/material";
import { Project } from "./project";
import { NPM } from "../npm/npm";
import { ProcessState } from "../process/process.state";
import { ConfigComponent } from "../config/config.component";
import { ComplexDependency } from "../dependency/complex-dependency";
import { PackageDependency } from "../dependency/package-dependency";
import { TasksComponent } from "../task/tasks.component";

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
    private config: ConfigService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public processState: ProcessState
  ) {
  }

  project: Project;
  complexDependencies: ComplexDependency[];
  packageDependencies: PackageDependency[];
  configuring = false;
  readonly ProjectType = ProjectType;
  public npm: NPM;

  applications: string[] = [];
  selectedApplication: string | undefined;
  @Input() projectIndex: number;
  @ViewChild("projectConfiguring", {static: false}) projectConfiguring: ConfigComponent;

  ngOnInit() {
    this.project = new Project(this.config.projects[this.projectIndex]);
    this.complexDependencies = this.project.dependencies.filter(
      (dependency): dependency is ComplexDependency => dependency instanceof ComplexDependency
    );
    this.packageDependencies = this.project.dependencies.filter(
      (dependency): dependency is PackageDependency => dependency instanceof PackageDependency
    );
    this.npm = new NPM(this.config.paths, this.project);
    if (this.project.type === ProjectType.Angular) {
      readFile(`${this.project.directory}/angular.json`, {encoding: "utf8"}, (err, data) => {
        if (err) {
          this.snackBar.open(`angular.json could not be found`, "Dismiss");
          return;
        }
        const angularProjectConfig: AngularProjectConfig = JSON.parse(stripComments(data));
        this.applications = Object.keys(angularProjectConfig.projects);

        const [defaultProject = angularProjectConfig.defaultProject] = this.applications;

        this.selectedApplication = defaultProject;
        this.changeDetector.markForCheck();
      });
    } else if (!this.project.type) {
      this.configuring = true;
    }
  }

  openTasks() {
    this.dialog.open(TasksComponent);
  }
}
