import { ChangeDetectionStrategy, Component, HostListener, ViewEncapsulation } from "@angular/core";
import { Command, ProjectType } from "../project/project";
import { ProjectState } from "../project/project.state";
import { PtyProcess } from "../process/pty.process";
import { ProcessState } from "../process/process.state";
import { SequentialProcess } from "../process/sequential.process";
import { map } from "rxjs/operators";
import { ReplacementService } from "./replacement.service";

@Component({
  selector: "lx-command-container",
  templateUrl: "./command-container.component.html",
  styleUrls: ["./command-container.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CommandContainerComponent {
  constructor(
    private projectState: ProjectState,
    private processState: ProcessState,
    private replacementService: ReplacementService
  ) {}

  isAngular$ = this.projectState.selected$.pipe(map(project => project && project.type === ProjectType.Angular));
  commands$ = this.projectState.selected$.pipe(map(project => project ? project.commands : []));
  queued?: Command[];


  @HostListener("document:keydown", ["$event"])
  queueCommands(event: KeyboardEvent) {
    if (event.shiftKey && !this.queued) {
      this.queued = [];
    }
  }

  @HostListener("document:keyup", ["$event"])
  executeCommands(event: KeyboardEvent) {
    if (!event.shiftKey && this.queued && this.queued.length) {
      this.processState.add(new SequentialProcess(
        this.queued.map(
          command => () => this.createProcess(command)
        ),
        this.queued.map(command => this.replacementService.replace(command.name)).join(" && ")
      ));
      this.queued = undefined;
    }
  }

  execute(command: Command) {
    if (this.queued) {
      this.queued = [...this.queued, command];
    } else {
      this.processState.add(this.createProcess(command));
    }
  }

  private createProcess(command: Command) {
    return new PtyProcess(
      this.replacementService.replace(command.directory),
      this.parse(this.replacementService.replace(command.segments)),
      this.replacementService.replace(command.name)
    );
  }

  parse(command: string): string[] {
    let isStringOpen = false;
    let isEscapeOpen = false;
    let currentSegment = "";
    const segments: string[] = [];

    for (let i = 0; i < command.length; i++) {
      const char = command.charAt(i);
      if (isEscapeOpen) {
        currentSegment += char;
        isEscapeOpen = false;
      } else if (char === "\\") {
        isEscapeOpen = true;
      } else if (char === "\"" || char === "'") {
        isStringOpen = !isStringOpen;
      } else if (isStringOpen) {
        currentSegment += char;
      } else if (char === " " && currentSegment) {
        segments.push(currentSegment);
        currentSegment = "";
      } else {
        currentSegment += char;
      }
    }

    segments.push(currentSegment);

    return segments;
  }
}
