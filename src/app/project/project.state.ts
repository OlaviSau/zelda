import { Injectable } from "@angular/core";
import { Project } from "./project";
import { select } from "../state/select";
import { State } from "../state/state";
import { include } from "../util/array/include";
import { exclude } from "../util/array/exclude";
import { other } from "../util/array/other";

@Injectable()
export class ProjectState extends State<{
  projects: Project[];
  selected?: Project;
}> {
  constructor() { super({ projects: [] }); }

  readonly all$ = this.pipe(select(state => state.projects));
  readonly selected$ = this.pipe(select(state => state.selected));

  select(selected?: Project) {
    this.update({selected});
  }

  delete(project: Project) {
    this.update({
      projects: exclude(this.value.projects, project),
      selected: other(this.value.projects, project)
    });
  }

  save(selected: Project) {
    let projects = this.value.projects;

    projects = include(projects, selected, this.value.selected && projects.indexOf(this.value.selected));

    this.update({projects});
  }
}
