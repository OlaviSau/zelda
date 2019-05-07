import {FormArray, FormControl, FormGroup} from "@angular/forms";

export class ProjectConfigForm {
  constructor(project) {
    this.group = new FormGroup({
      name: new FormControl(project.name),
      type: new FormControl(project.type),
      directory: new FormControl(project.directory),
      dependencies: new FormArray(project.dependencies.map(
        dependency => new FormGroup(
          {
            name: new FormControl(dependency.name),
            type: new FormControl(dependency.type),
            directory: new FormControl(dependency.directory)
          }
        )
      ))
    });
  }

  group;

  addDependency() {
    this.group.controls.dependencies.push(new FormGroup(
      {
        "name": new FormControl(""),
        "type": new FormControl(""),
        "directory": new FormControl("")
      })
    );
  }

  removeDependency(index) {
    this.group.controls.dependencies.removeAt(index);
  }

  get dependencies() {
    return this.group.controls.dependencies.controls;
  }
}
