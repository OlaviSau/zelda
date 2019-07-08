import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  Input,
  ViewEncapsulation
} from "@angular/core";
import { map } from "rxjs/operators";
import { DependencyState } from "./dependency.state";
import { SequentialProcess } from "../process/sequential.process";
import { PtyProcess } from "../process/pty.process";
import { Project } from "../project/project";
import { ProcessState } from "../process/process.state";
import { Dependency } from "./dependency";

@Component({
  selector: "lx-package-dependency",
  templateUrl: "./package-dependency.component.html",
  styleUrls: ["./package-dependency.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackageDependencyComponent {

  constructor(
    private dependencyState: DependencyState,
    private processState: ProcessState
  ) {}
  @Input() dependency!: Dependency;
  @Input() project!: Project;

  @HostBinding("class.linking") linking = false;

  linking$ = this.dependencyState.linking$.pipe(
    map(links => this.linking = !!links.find(
      link => link.project === this.project && link.dependency === this.dependency
    )),
  );

  @HostListener("click") link() {
    const command = new SequentialProcess(
      [
        () => new PtyProcess(this.dependency.directory, ["npm", "link"]),
        () => new PtyProcess(this.project.directory, ["npm", "link", this.dependency.name])
      ],
      `${this.project.name}: Link ${this.dependency.name}`
    );
    this.processState.add(command);
    const link = {project: this.project, dependency: this.dependency};
    this.dependencyState.linking(link);

    command.buffer$.subscribe({
      error: () => this.dependencyState.linkingComplete(link),
      complete: () => this.dependencyState.linkingComplete(link)
    });
  }
}
