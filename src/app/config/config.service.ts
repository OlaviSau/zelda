import {Injectable} from "@angular/core";
import {Config, Paths, ProjectConfig, ProjectType} from "../app.model";
import {existsSync, readFileSync, writeFileSync} from "fs";
import {MatSnackBar} from "@angular/material";

@Injectable()
export class ConfigService implements Config {
  public paths: Paths;
  public projects: ProjectConfig[];

  constructor(
    private snackBar: MatSnackBar
  ) {
    if (existsSync("config.json")) {
      const config = JSON.parse(readFileSync("config.json", {encoding: "utf8"})) as Config;
      this.paths = config.paths;
      this.projects = this.addCreationProject(config.projects);
    }
  }

  save(project: ProjectConfig, index: number) {
    if (!project || !project.name) {
      this.snackBar.open(`A project must have a name`, "Dismiss");
      return false;
    } else if (project.type === ProjectType.Angular && !existsSync(`${project.directory}/angular.json`)) {
      this.snackBar.open(`${project.directory}/angular.json could not be found`, "Dismiss");
      return false;
    }
    project.dependencies = project.dependencies.filter(dep => dep.name && dep.directory && dep.type);

    this.projects = Object.assign([...this.projects], {
      [index]: {
        ...this.projects[index],
        ...project
      }
    });


    writeFileSync("config.json", JSON.stringify({
      paths: this.paths,
      projects: this.projects
    }, null, 2), {encoding: "utf8"});
    this.projects = this.addCreationProject(this.projects);

    return true;
  }

  addCreationProject(projects: ProjectConfig[]) {
    if (!projects.find(p => !p.name)) {
      return [...projects, {
        name: "",
        type: null,
        directory: "",
        dependencies: []
      }];
    }
    return projects;
  }
}
