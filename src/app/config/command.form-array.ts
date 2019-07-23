import { FormControl, FormGroup } from "@angular/forms";
import { DynamicFormArray } from "../form/dynamic.form-array";
import { Command } from "../project/project";

export class CommandFormArray extends DynamicFormArray<Command> {

  createIndex(command: Partial<Command>) {
    return new FormGroup({
      name: new FormControl(command.name || ""),
      directory: new FormControl(command.directory || ""),
      segments: new FormControl(command.segments || ""),
      icon: new FormControl(command.icon || "")
    });
  }
}
