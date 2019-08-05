import { Injectable } from "@angular/core";
import { JsonFile } from "../file/json.file";
import { Project } from "../project/project";
import { remote } from "electron";

@Injectable()
export class Config extends JsonFile<{
  projects: Project[];
  selected?: Project;
}> {
  constructor() {
    super(Config.resolveConfig(), { encoding: "utf8" });
  }
  static resolveConfig() {
    const argv = remote.process.argv;
    let isConfig = false;
    for (const arg of argv) {
      if (isConfig) {
        return arg;
      }
      if (arg === "--config") {
        isConfig = true;
      }
    }
    return "config.json";
  }
}
