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
  ) {}
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
    this.processService.execute({
      commands: [
        {
          directory: this.dependency.directory,
          segments: "npm link"
        },
        {
          directory: this.project.directory,
          segments: `npm link "${this.dependency.name}"`
        }
      ],
      name: `${this.project.name}: Link ${this.dependency.name}`
    }).then(process => {
      this.queued = false;
      const link = {project: this.project, dependency: this.dependency};
      this.dependencyState.linking(link);
      process.buffer$.subscribe({
        error: () => this.dependencyState.linkingComplete(link),
        complete: () => this.dependencyState.linkingComplete(link)
      });
    });
  }
}
