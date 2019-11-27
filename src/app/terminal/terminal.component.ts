import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { map } from "rxjs/operators";

import { ProcessState } from "../process/process.state";
import { ProjectState } from "../project/project.state";

@Component({
  selector: "lx-terminal",
  styleUrls: ["./terminal.component.scss"],
  templateUrl: "./terminal.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TerminalComponent {

  constructor(
    public processState: ProcessState,
    public projectState: ProjectState
  ) {}

  rows$ = this.projectState.selected$.pipe(
    map(project => +((project && project.terminal && project.terminal.rows) || 30))
  );

}
