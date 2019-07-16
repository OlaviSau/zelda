import { Injectable } from "@angular/core";
import { JsonFile } from "../file/json.file";
import { Project } from "../project/project";

@Injectable()
export class Config extends JsonFile<{
  projects: Project[];
  selected?: Project;
}> {
  constructor() {
    super("config.json", { encoding: "utf8" });
  }
}
