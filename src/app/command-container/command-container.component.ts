import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from "@angular/core";
import { ignoreNil } from "../util/ignore-nil";
import { filter, map, switchMap } from "rxjs/operators";
import { Command, Project, ProjectType } from "../project/project";
import { readFile } from "fs";
import { stripComments } from "tslint/lib/utils";
import { ProjectState } from "../project/project.state";
import { MatDialog, MatSnackBar } from "@angular/material";
import { PtyProcess } from "../process/pty.process";
import { ProcessState } from "../process/process.state";
import { ConfigComponent } from "../config/config.component";
import { TasksComponent } from "../task/tasks.component";

@Component({
  selector: "lx-command-container",
  templateUrl: "./command-container.component.html",
  styleUrls: ["./command-container.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CommandContainerComponent {
  constructor(
    public projectState: ProjectState,
    private processState: ProcessState,
    private snack: MatSnackBar,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  isAngular$ = this.projectState.selected$.pipe(
    ignoreNil(),
    map(project => project.type === ProjectType.Angular)
  );
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
        const angularConfig: {
          projects: {
            [key: string]: any
          };
          defaultProject?: string;
        } = JSON.parse(stripComments(data));
        const applications = Object.keys(angularConfig.projects);
        const [defaultProject = angularConfig.defaultProject] = applications;

        this.selectedApplication = defaultProject;
        this.changeDetector.markForCheck();
        Object.keys(angularConfig.projects);

        resolve(applications);
      });
    }))
  );

  execute(project: Project, command: Command) {
    this.processState.add(
      new PtyProcess(
        this.replace(command.directory, project),
        this.parse(this.replace(command.segments, project)),
        this.replace(command.name, project)
      )
    );
  }

  replace(value: string, project: Project) {
    const replacements: { [key: string]: string } = {
      "<project.directory>": project.directory,
      "<project.name>": project.name,
      "<angular.project>": this.selectedApplication || ""
    };
    for (const key in replacements) {
      value = value.replace(key, replacements[key]);
    }
    return value;
  }

  parse(command: string): string[] {
    let isStringOpen = false;
    let isEscapeOpen = false;
    let currentSegment = "";
    const segments: string[] = [];

    for (let i = 0; i < command.length; i++) {
      const char = command.charAt(i);
      if (isEscapeOpen) {
        currentSegment += char;
        isEscapeOpen = false;
      } else if (char === "\\") {
        isEscapeOpen = true;
      } else if (char === "\"" || char === "'") {
        isStringOpen = !isStringOpen;
      } else if (isStringOpen) {
        currentSegment += char;
      } else if (char === " " && currentSegment) {
        segments.push(currentSegment);
        currentSegment = "";
      } else {
        currentSegment += char;
      }
    }

    segments.push(currentSegment);

    return segments;
  }

  openConfig() {
    this.dialog.open(ConfigComponent, {
      maxHeight: "100vh",
      maxWidth: "100vw",
      height: "100vh",
      width: "100vw"
    });
  }

  openTasks() {
    this.dialog.open(TasksComponent);
  }
}
