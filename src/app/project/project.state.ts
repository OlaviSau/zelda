import { Injectable } from "@angular/core";
import { Project } from "./project";
import { PtyProcess } from "../process/pty.process";
import { ProcessState } from "../process/process.state";
import { ConcurrentProcess } from "../process/concurrent.process";
import { SequentialProcess } from "../process/sequential.process";
import { select } from "../state/select";
import { JsonFile } from "../file/json.file";
import { State } from "../state/state";
import { include } from "../util/array/include";
import { exclude } from "../util/array/exclude";
import { other } from "../util/array/other";

@Injectable()
export class ProjectState extends State<{
  projects: Project[];
  selected?: Project;
}> {
  private config = new JsonFile<{
    projects: Project[];
    selected?: Project;
  }>("config.json");
  readonly all$ = this.pipe(select(state => state.projects));
  readonly selected$ = this.pipe(select(state => state.selected));

  constructor(private processState: ProcessState) {
    super({projects: []});
    this.config.read().then(
      state => this.next({
        ...state,
        selected: state.projects[0]
      })
    );
  }

  select(selected?: Project) {
    this.update({selected});
  }

  delete(project: Project) {
    const projects = exclude(this.value.projects, project);

    this.update({projects, selected: other(projects, project)});
    this.config.write({projects});
  }

  save(selected: Project) {
    let projects = this.value.projects;

    projects = include(projects, selected, this.value.selected && projects.indexOf(this.value.selected));

    this.update({projects, selected});
    this.config.write({projects});
  }

  deploy(project: Project, dependencies: { [key: string]: string[] }) {
    this.processState.add(
      new ConcurrentProcess(
        Object.keys(dependencies).filter(directory => dependencies[directory].length).map(
          directory => new SequentialProcess(
            [
              () => new PtyProcess(
                directory,
                ["npm", "run", "build"],
                `${project.name}: Build`
              ),
              () => new PtyProcess(directory, [
                  "npm",
                  "run",
                  "release",
                  "--",
                  "--skip-git",
                  "--canary",
                  `dev-zelda-${Date.now()}`,
                  "--npm-tag",
                  `dev-zelda-${Date.now()}`].concat(
                ...dependencies[directory].map(name => ["--scope", name])
                ),
                `${project.name}: Release${dependencies[directory].map(name => ` ${name}`)}`
              )
            ]
          )
        ),
        `${project.name}: Deploy`
      )
    );
  }
}
