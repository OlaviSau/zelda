import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";

import { Terminal } from "xterm";
import { debounce } from "../util/debounce";
import { ProcessState } from "../process/process.state";
import { Subscription } from "rxjs";
import { ProjectState } from "../project/project.state";

@Component({
  selector: "lx-terminal",
  styleUrls: ["./terminal.component.scss"],
  templateUrl: "./terminal.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TerminalComponent implements OnDestroy {

  constructor(
    public processState: ProcessState,
    public projectState: ProjectState
  ) {}

  rows = 30;
  private terminal = new Terminal({
    cols: Math.floor(window.innerWidth / 7) - 1,
    rows: this.rows,
    fontSize: 12,
    theme: {
      background: "#1e1e1e"
    },
    windowsMode: true
  });

  private resizeTerminal$$ = this.projectState.selected$.subscribe(
    project => {
      if (project) {
        this.terminal.resize(Math.floor(window.innerWidth / 7) - 1, project.terminal.rows);
        this.rows = project.terminal.rows;
      }
    }
  );

  private buffer$$: Subscription | undefined;
  private selected$$ = this.processState.selected$.subscribe(
    process => {
      this.terminal.reset();
      if (this.buffer$$) {
        this.buffer$$.unsubscribe();
      }
      if (process) {
        this.buffer$$ = process.subscribe({
          next: chunk => this.terminal.write(chunk),
          complete: () => this.terminal.writeln("The process has exited"),
          error: code => this.terminal.writeln(`The process errored with code: ${code}`)
        });
      }
    }
  );

  @ViewChild("container", {
    read: ElementRef, static: true
  }) set container(container: ElementRef) {
    this.terminal.open(container.nativeElement);
    this.terminal.onSelectionChange(() => document.execCommand("copy"));
  }

  @HostListener("window:resize")
  @debounce()
  onResize() {
    this.terminal.resize(Math.floor(window.innerWidth / 7) - 1, this.rows);
  }

  ngOnDestroy() {
    if (this.buffer$$) {
      this.buffer$$.unsubscribe();
    }
    this.resizeTerminal$$.unsubscribe();
    this.selected$$.unsubscribe();
    this.terminal.dispose();
  }
}
