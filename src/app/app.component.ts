import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from "@angular/core";
import { ProjectState } from "./project/project.state";
import { Command, Project, ProjectType } from "./project/project";
import { MatDialog, MatSnackBar } from "@angular/material";
import { TasksComponent } from "./task/tasks.component";
import { ignoreNil } from "./util/ignore-nil";
import { filter, switchMap } from "rxjs/operators";
import { stripComments } from "tslint/lib/utils";
import { readFile } from "fs";
import { ConfigComponent } from "./config/config.component";
import { ProcessState } from "./process/process.state";
import { PtyProcess } from "./process/pty.process";

@Component({
  selector: "lx-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(
    public projectState: ProjectState,
    private processState: ProcessState,
    private matDialog: MatDialog,
    private snack: MatSnackBar,
    private changeDetector: ChangeDetectorRef
  ) {}

  selectedApplication: string | undefined;
  applications$ = this.projectState.selected$.pipe(
    ignoreNil(),
    filter(project => !!project.directory && project.type === ProjectType.Angular),
    switchMap(project => new Promise(resolve => {
      readFile(`${project.directory}/angular.json`, {encoding: "utf8"}, (err, data) => {
        if (err) {
          this.snack.open(`angular.json could not be found`, "Dismiss");
          return;
        }
        const angularProjectConfig: {
          projects: {
            [key: string]: any
          };
          defaultProject?: string;
        } = JSON.parse(stripComments(data));
        const applications = Object.keys(angularProjectConfig.projects);
        const [defaultProject = angularProjectConfig.defaultProject] = applications;

        this.selectedApplication = defaultProject;
        this.changeDetector.markForCheck();
        Object.keys(angularProjectConfig.projects);

        resolve(applications);
      });
    })
  ));

  execute(project: Project, command: Command) {
    this.processState.add(
      new PtyProcess(
        this.replace(command.directory, project),
        command.segments.map(segment => this.replace(segment, project)),
        this.replace(command.name, project)
      )
    );
  }

  replace(value: string, project: Project) {
    const replacements: { [key: string]: string } = {
      "<project.directory>": project.directory,
      "<project.name>": project.name,
      "<application.selected>": this.selectedApplication || ""
    };
    for (const key in replacements) {
      value = value.replace(key, replacements[key]);
    }
    return value;
  }

  openConfig() {
    this.matDialog.open(ConfigComponent, {
      maxHeight: "100vh",
      maxWidth: "100vw",
      height: "100vh",
      width: "100vw"
    });
  }

  openTasks() {
    this.matDialog.open(TasksComponent);
  }
}
