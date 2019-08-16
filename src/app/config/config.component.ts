import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { DependencyType } from "../dependency/dependency";
import { Project } from "../project/project";
import { ProjectState } from "../project/project.state";
import { MatDialogRef } from "@angular/material";
import { FormControl, FormGroup } from "@angular/forms";
import { FormGroup as FormGroupType } from "../form/types";
import { DependencyFormArray } from "./dependency.form-array";
import { CommandFormArray } from "./command.form-array";
import { tap } from "rxjs/operators";

@Component({
  selector: "lx-config",
  templateUrl: "./config.component.html",
  styleUrls: ["./config.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ConfigComponent {

  readonly DependencyType = DependencyType;

  constructor(
    public projectState: ProjectState,
    public dialog: MatDialogRef<ConfigComponent>
  ) {}

  form = new FormGroup({
    name: new FormControl(""),
    directory: new FormControl(""),
    dependencies: new DependencyFormArray([]),
    commands: new CommandFormArray([])
  }) as FormGroupType<Project>;

  project$ = this.projectState.selected$.pipe(
    tap((project = {
      name: "",
      directory: "",
      dependencies: [],
      commands: []
    }) => this.form.setValue(project))
  );
}
