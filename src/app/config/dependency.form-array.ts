import { FormControl, FormGroup } from "@angular/forms";
import { Dependency, DependencyType } from "../dependency/dependency";
import { DynamicFormArray } from "../form/dynamic.form-array";

export class DependencyFormArray extends DynamicFormArray<Dependency> {
  createControl(dependency: Partial<Dependency> = {}) {
    return new FormGroup({
      name: new FormControl(dependency.name || ""),
      type: new FormControl(dependency.type || DependencyType.Lerna),
      directory: new FormControl(dependency.directory || ""),
    });
  }
}
