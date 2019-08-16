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
import { ProcessService } from "../process/process.service";
import { SequentialProcess } from "../process/sequential.process";
import { PtyProcess } from "../process/pty.process";

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
    public processService: ProcessService
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
    const process = new SequentialProcess([
        new PtyProcess(this.dependency.directory, "npm link"),
        // this is really important to trigger watcher
        new PtyProcess(this.project.directory, `rm -rf "node_modules/${this.dependency.name}"`),
        new PtyProcess(this.project.directory, `npm link "${this.dependency.name}"`)
      ],
      `${this.project.name}: Link ${this.dependency.name}`
    );
    process.buffer$.subscribe({
      next: () => {
        this.dependencyState.linking(link);
        this.queued = false;
      },
      error: () => this.dependencyState.linkingComplete(link),
      complete: () => this.dependencyState.linkingComplete(link)
    });

    this.processService.execute(process);
  }
}
