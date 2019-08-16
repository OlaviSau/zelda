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

@Component({
  selector: "lx-terminal",
  styleUrls: ["./terminal.component.scss"],
  templateUrl: "./terminal.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TerminalComponent implements OnDestroy {
  constructor(public processState: ProcessState) {}

  private terminal = new Terminal({
    cols: Math.floor(window.innerWidth / 7) - 1,
    rows: 30,
    fontSize: 12,
    theme: {
      background: "#1e1e1e"
    },
    windowsMode: true
  });

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

  private buffer$$: Subscription | undefined;

  @ViewChild("container", {
    read: ElementRef, static: true
  }) set container(container: ElementRef) {
    this.terminal.open(container.nativeElement);
    this.terminal.onSelectionChange(() => document.execCommand("copy"));
  }

  @HostListener("window:resize")
  @debounce()
  onResize() {
    this.terminal.resize(Math.floor(window.innerWidth / 7) - 1, 30);
  }

  ngOnDestroy() {
    if (this.buffer$$) {
      this.buffer$$.unsubscribe();
    }
    this.selected$$.unsubscribe();
    this.terminal.dispose();
  }
}
