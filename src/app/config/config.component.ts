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

  form = this.createForm({});

  project$$ = this.projectState.selected$.subscribe(
    (project) => this.form = this.createForm(project || {})
  );
  addCommand(command: Partial<Command> = {}) {
    this.form.controls.commands.push(this.createCommand(command));
  }

  removeCommand(index: number) {
    this.form.controls.commands.removeAt(index);
  }

  addDependency(dependency: Partial<Dependency> = {}) {
    this.form.controls.dependencies.push(this.createDependency(dependency));
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

  createForm({
    name = "",
    type = ProjectType.Angular,
    directory = "",
    dependencies = [],
    commands = []
   }: Partial<Project> = {}): FormGroupType<Project> {
    return new FormGroup({
      name: new FormControl(name),
      type: new FormControl(type),
      directory: new FormControl(directory),
      dependencies: new FormArray(dependencies.map(dependency => this.createDependency(dependency))),
      commands: new FormArray(commands.map(command => this.createCommand(command)))
    }) as FormGroupType<Project>;
  }

  createCommand({
    name = "",
    tip = "",
    directory = "",
    segments = "",
    icon = ""
  }: Partial<Command>) {
    return new FormGroup({
      name: new FormControl(name),
      directory: new FormControl(directory),
      segments: new FormControl(segments),
      icon: new FormControl(icon),
      tip: new FormControl(tip)
    });
  }

  createDependency({
    name = "",
    type = DependencyType.Lerna,
    directory = ""
  }: Partial<Dependency>) {
    return new FormGroup({
      name: new FormControl(name),
      type: new FormControl(type),
      directory: new FormControl(directory),
    });
  }
}
