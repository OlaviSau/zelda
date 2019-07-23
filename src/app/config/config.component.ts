import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from "@angular/core";
import { Dependency, DependencyType } from "../dependency/dependency";
import { Command, Project } from "../project/project";
import { ProjectState } from "../project/project.state";
import { MatDialog } from "@angular/material";
import { FormControl, FormGroup } from "@angular/forms";
import { FormGroup as FormGroupType } from "../form/types";
import { Config } from "./config";
import { DependencyFormArray } from "./dependency.form-array";
import { CommandFormArray } from "./command.form-array";

@Component({
  selector: "lx-config",
  templateUrl: "./config.component.html",
  styleUrls: ["./config.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ConfigComponent implements OnDestroy {

  readonly DependencyType = DependencyType;

  constructor(
    public projectState: ProjectState,
    private dialog: MatDialog,
    private config: Config
  ) {}

  form = new FormGroup({
    name: new FormControl(""),
    directory: new FormControl(""),
    dependencies: new DependencyFormArray([]),
    commands: new CommandFormArray([])
  }) as FormGroupType<Project>;

  project$$ = this.projectState.selected$.subscribe(
    (project = {
      name: "",
      directory: "",
      dependencies: [],
      commands: []
    }) => this.form.setValue(project)
  );
  addCommand(command: Partial<Command> = {}) {
    this.form.controls.commands.push(this.form.controls.commands.createIndex(command));
  }

  removeCommand(index: number) {
    this.form.controls.commands.removeAt(index);
  }

  addDependency(dependency: Partial<Dependency> = {}) {
    this.form.controls.dependencies.push(this.form.controls.dependencies.createIndex(dependency));
  }

  removeDependency(index: number) {
    this.form.controls.dependencies.removeAt(index);
  }

  ngOnDestroy() {
    this.project$$.unsubscribe();
  }

  save() {
    this.projectState.save(this.form.value);
    this.config.write({projects: this.projectState.value.projects});
    this.dialog.closeAll();
  }

  delete(project: Project) {
    this.projectState.delete(project);
    this.config.write({projects: this.projectState.value.projects});
    this.dialog.closeAll();
  }

  cancel() {
    this.dialog.closeAll();
  }
}
