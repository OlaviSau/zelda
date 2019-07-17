import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  ViewEncapsulation
} from "@angular/core";
import { ProjectState } from "../project.state";
import { catchError, shareReplay, switchMap, tap } from "rxjs/operators";
import { Project } from "../project";
import { ignoreNil } from "../../util/ignore-nil";
import { Repository } from "nodegit";
import { EMPTY } from "rxjs";
import { ProcessService } from "../../process/process.service";
import { resolve } from "path";
import { FormControl } from "@angular/forms";

@Component({
  selector: "lx-git-branch",
  templateUrl: "./git-branch.component.html",
  styleUrls: ["./git-branch.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GitBranchComponent {

  @HostBinding("attr.hidden") hidden: true | undefined = true;

  constructor(
    public projectState: ProjectState,
    private processService: ProcessService
  ) {}

  private repository$ = this.projectState.selected$.pipe(
    ignoreNil(),
    // tslint:disable-next-line:no-bitwise
    switchMap((project: Project) => Repository.openExt(project.directory, 1 << 4, resolve(project.directory, ".."))),
    tap(() => this.hidden = undefined),
    shareReplay(),
    catchError(() => {
      this.hidden = true;
      return EMPTY;
    }),
  );

  branch = new FormControl("");

  branches$ = this.repository$.pipe(
    switchMap(repository => repository.getReferences(1)
        .then(references => references
          .filter(reference => {
            if (reference.isHead()) {
              this.branch.setValue(reference.shorthand());
            }

            return !reference.isRemote() && reference.isBranch();
          })
          .map(reference => reference.shorthand()))
    )
  );

  checkoutBranch(branch: string) {
    if (this.projectState.value.selected) {
      this.processService.execute({
        name: `${this.projectState.value.selected.name}: Checkout ${branch}`,
        directory: `${this.projectState.value.selected.directory}`,
        segments: `git checkout ${branch}`
      }).then(process => process.buffer$.subscribe({
        error: () => undefined
      }));
    }
  }
}
