import {Injectable} from "@angular/core";
import {Config, Paths, Project, ProjectType} from "../app.model";
import {existsSync, readFileSync, writeFileSync} from "fs";
import {LernaService} from "../lerna/lerna.service";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {MatSnackBar} from "@angular/material";

@Injectable()
export class ConfigService implements Config {
  public paths: Paths;
  public projects: Project[];
  public configuringProjectIndex: undefined | number = undefined;
  public projectForm;

  constructor(
    private lernaService: LernaService,
    private snackBar: MatSnackBar
  ) {
    if (existsSync("config.json")) {
      const config = JSON.parse(readFileSync("config.json", {encoding: "utf8"})) as Config;
      this.paths = config.paths;
      this.projects = config.projects;
      this.lernaService.addProjects(config.projects);
    }
  }

  configure(index: number) {
    const project = this.projects[index];
    this.projectForm = new FormGroup({
      "name": new FormControl(project.name),
      "type": new FormControl(project.type),
      "directory": new FormControl(project.directory),
      "dependencies": new FormArray(project.dependencies.map(
        dependency => new FormGroup(
          {
            "name": new FormControl(dependency.name),
            "type": new FormControl(dependency.type),
            "directory": new FormControl(dependency.directory)
          }
        )
      ))
    });
    this.configuringProjectIndex = index;
  }

  addDependency() {
    this.projectForm.get("dependencies").push(new FormGroup(
      {
        "name": new FormControl(""),
        "type": new FormControl(""),
        "directory": new FormControl("")
      })
    );
  }

  removeDependency(index) {
    this.projectForm.get("dependencies").removeAt(index);
  }

  save() {
    const projectToSave = this.projectForm.value as Project;
    if (projectToSave.type === ProjectType.Angular && !existsSync(`${projectToSave.directory}/angular.json`)) {
      this.snackBar.open(`${projectToSave.directory}/angular.json could not be found`, "Dismiss");
      this.configuringProjectIndex = undefined;
      return;
    }

    projectToSave.dependencies = projectToSave.dependencies.filter(dep => dep.name && dep.directory && dep.type);

    this.projects = Object.assign([], this.projects, {[this.configuringProjectIndex]: {
        ...this.projects[this.configuringProjectIndex],
        ...projectToSave
    }});
    this.configuringProjectIndex = undefined;

    writeFileSync("config.json", JSON.stringify({
      paths: this.paths,
      projects: this.projects
    }, null, 2), { encoding: "utf8" });
  }
}
