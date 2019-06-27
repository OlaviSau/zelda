import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import {DependencyType, ProjectConfig, ProjectType} from "../app.model";
import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";

interface ConfigFormGroup extends FormGroup {
  controls: {
    name: AbstractControl,
    type: AbstractControl,
    directory: AbstractControl,
    dependencies: FormArray
  };
}

@Component({
  selector: "app-config",
  templateUrl: "./config.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ConfigComponent implements OnInit {

  readonly ProjectType = ProjectType;
  readonly DependencyType = DependencyType;

  @Input() project: ProjectConfig;

  form: ConfigFormGroup;
  dependencies: FormArray;

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(this.project.name),
      type: new FormControl(this.project.type),
      directory: new FormControl(this.project.directory),
      dependencies: new FormArray(this.project.dependencies.map(
        dependency => new FormGroup(
          {
            name: new FormControl(dependency.name),
            type: new FormControl(dependency.type),
            directory: new FormControl(dependency.directory)
          }
        )
      ))
    }) as ConfigFormGroup;
    this.dependencies = this.form.controls.dependencies;
  }

  addDependency() {
    this.dependencies.push(new FormGroup(
      {
        "name": new FormControl(""),
        "type": new FormControl(""),
        "directory": new FormControl("")
      })
    );
  }

  removeDependency(index: number) {
    this.dependencies.removeAt(index);
  }
}
