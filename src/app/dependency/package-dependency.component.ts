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
import { Project } from "../project/project";
import { Dependency } from "./dependency";
import { SequentialCommand } from "../process/sequential.command";
import { PtyCommand } from "../process/pty.command";
import { ProcessService } from "../process/process.service";

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
    private processService: ProcessService
  ) {
  }

  @Input() dependency!: Dependency;
  @Input() project!: Project;

  @HostBinding("class.linking") linking = false;
  @HostBinding("class.queued") queued = false;

  linking$ = this.dependencyState.linking$.pipe(
    map(links => this.linking = !!links.find(
      link => link.project === this.project && link.dependency === this.dependency
    )),
  );

  @HostListener("click") link() {
    this.queued = true;
    const link = {project: this.project, dependency: this.dependency};
    this.processService.execute(
      new SequentialCommand([
          new PtyCommand(this.dependency.directory, "npm link"),
          // this is really important to trigger watcher
          new PtyCommand(this.project.directory, `rm -rf "node_modules/${this.dependency.name}"`),
          new PtyCommand(this.project.directory, `npm link "${this.dependency.name}"`)
        ],
        `${this.project.name}: Link ${this.dependency.name}`
      )
    ).then(
      process => {
        this.dependencyState.linking(link);
        this.queued = false;
        process.subscribe({
          error: () => this.dependencyState.linkingComplete(link),
          complete: () => this.dependencyState.linkingComplete(link)
        });
      }
    );
  }
}
