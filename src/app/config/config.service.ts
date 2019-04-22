import {Injectable} from "@angular/core";
import {Config, Paths, Project} from "../app.model";
import {existsSync, readFileSync} from "fs";
import {LernaService} from "../lerna/lerna.service";

@Injectable()
export class ConfigService {
  public paths: Paths;
  public projects: Project[];
  public exists = false;

  public example = `
    {
      "projects": [
        {
          "name": "Mobile",
          "dependencies": [
            {
              "directory": "C:/directory/",
              "name": "@scope/example"
            }
          ]
        }
    }
  `;

  constructor(
    private lernaService: LernaService
  ) {
    if (existsSync("config.json")) {
      const config = JSON.parse(readFileSync("config.json", {encoding: "utf8"})) as Config;
      this.paths = config.paths;
      this.projects = config.projects;
      this.lernaService.addProjects(config.projects);
      this.exists = true;
    }
  }
}
