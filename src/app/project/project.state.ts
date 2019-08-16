import { Injectable } from "@angular/core";
import { Project } from "./project";
import { select } from "../state/select";
import { State } from "../state/state";
import { move } from "../util/array/move";
import { include } from "../util/array/include";
import { exclude } from "../util/array/exclude";
import { other } from "../util/array/other";
import { Config } from "../config/config";

@Injectable()
export class ProjectState extends State<{
  projects: Project[];
  selected?: Project;
}> {
  constructor(private config: Config) { super({ projects: [] }); }

  readonly all$ = this.pipe(select(state => state.projects));
  readonly selected$ = this.pipe(select(state => state.selected));

  move(previousIndex: number, currentIndex: number) {
    this.update({projects: move(this.value.projects, previousIndex, currentIndex)});
    this.config.write({projects: this.value.projects});
  }

  select(selected?: Project) {
    this.update({selected});
  }

  delete(project: Project) {
    this.update({
      projects: exclude(this.value.projects, project),
      selected: other(this.value.projects, project)
    });
    this.config.write({projects: this.value.projects});
  }

  save(project: Project) {
    const { projects, selected } = this.value;

    this.update({
      projects: include(projects, project, selected),
      selected: project
    });
    this.config.write({projects: this.value.projects});
  }
}
