import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { scan } from "rxjs/operators";
import { select } from "../util/select";
import { PackageDependency } from "./package-dependency";
import { Project } from "../project/project";
import { ConfigService } from "../config/config.service";
import { ProcessState } from "../process/process.state";
import { SequentialCommand } from "../process/sequential-command";
import { Command } from "../process/command";
import { Paths } from "../app.model";

interface State {
  linking: Link[];
}

interface Link {
  project: Project;
  dependency: PackageDependency;
}

@Injectable({
  providedIn: "root"
})
export class DependencyState {
  constructor(private config: ConfigService, private processState: ProcessState) {}

  private actions$ = new BehaviorSubject<(state: State) => State>(state => state);
  private state$ = this.actions$.pipe(
    scan((state: State, action) => action(state), {
      linking: []
    }));

  linking$ = this.state$.pipe(
    select(state => state.linking)
  );

  link(link: Link) {
    const command = new SequentialCommand(
      [
        () => this.command(link.dependency.directory, ["npm", "link"]),
        // () => this.command(this.project.directory, ["rm", "-rf", `node_modules/${name}`]),
        () => this.command(link.project.directory, ["npm", "link", link.dependency.name])
      ],
      `${link.project.name}: Link ${link.dependency.name}`
    );

    this.processState.add(command);

    this.actions$.next(state => ({
      linking: [...state.linking, link]
    }));

    command.buffer$.subscribe({
      complete: () => this.actions$.next(state => ({
        linking: state.linking.filter(linking => link !== linking)
      }))
    });
  }

  private command(cwd: string, segments: string[], name?: string): Command {
    return new Command(
      cwd,
      segments.map(segment => this.config.paths[segment as keyof Paths] || segment),
      name
    );
  }
}
