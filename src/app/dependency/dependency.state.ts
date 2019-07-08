import { Injectable } from "@angular/core";
import { Project } from "../project/project";
import { select } from "../state/select";
import { Dependency } from "./dependency";
import { State } from "../state/state";

interface Link {
  project: Project;
  dependency: Dependency;
}

@Injectable()
export class DependencyState extends State<{ linking: Link[] }> {
  constructor() {
    super({ linking: [] });
  }

  linking$ = this.pipe(
    select(state => state.linking)
  );

  linking(link: Link) {
    this.update({ linking: [...this.value.linking, link] });
  }

  linkingComplete(link: Link) {
    this.update({
      linking: this.value.linking.filter(linking => linking !== link)
    });
  }
}
