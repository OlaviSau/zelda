import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from "@angular/core";
import { Dependency, DependencyType } from "../dependency/dependency";
import { Command, Project, ProjectType } from "../project/project";
import { ProjectState } from "../project/project.state";
import { MatDialog } from "@angular/material";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { FormGroup as FormGroupType } from "../form/types";

@Component({
  selector: "lx-config",
  templateUrl: "./config.component.html",
  styleUrls: ["./config.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ConfigComponent implements OnDestroy {

  readonly ProjectType = ProjectType;
  readonly DependencyType = DependencyType;

  constructor(
    public projectState: ProjectState,
    private dialog: MatDialog
  ) {}

  form = new FormGroup({
    name: new FormControl(""),
    type: new FormControl(ProjectType.Angular),
    directory: new FormControl(""),
    dependencies: new FormArray([]),
    commands: new FormArray([])
  }) as FormGroupType<Project>;

  project$$ = this.projectState.selected$.subscribe(
    project => {
      if (project) {
        for (const dependency of project.dependencies) {
          this.addDependency(dependency);
        }
        for (const command of project.commands) {
          this.addCommand(command);
        }
        this.form.patchValue(project);
      }
    }
  );
  addCommand(command?: Command) {
    this.form.controls.commands.push(
      new FormGroup({
        name: new FormControl(command ? command.name : ""),
        directory: new FormControl(command ? command.directory : ""),
        segments: new FormArray(command ? command.segments.map(segment => new FormControl(segment)) : []),
        icon: new FormControl(command ? command.icon : ""),
        tip: new FormControl(command ? command.tip : "")
      })
    );
  }

  removeCommand(index: number) {
    this.form.controls.commands.removeAt(index);
  }

  addDependency(dependency?: Dependency) {
    this.form.controls.dependencies.push(
      new FormGroup({
        name: new FormControl(dependency ? dependency.name : ""),
        type: new FormControl(dependency ? dependency.type : DependencyType.Lerna),
        directory: new FormControl(dependency ? dependency.directory : ""),
      })
    );
  }

  removeDependency(index: number) {
    this.form.controls.dependencies.removeAt(index);
  }

  ngOnDestroy() {
    this.project$$.unsubscribe();
  }

  save() {
    this.projectState.save(this.form.value);
    this.dialog.closeAll();
  }

  delete(project: Project) {
    this.projectState.delete(project);
    this.dialog.closeAll();
  }

  cancel() {
    this.dialog.closeAll();
  }
}
