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
import { switchMap, tap } from "rxjs/operators";
import { ignoreNil } from "../util/ignore-nil";

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

  private buffer$$ = this.processState.selected$.pipe(
    tap(() => this.terminal.reset()),
    ignoreNil(),
    switchMap(process => process.buffer$),
  ).subscribe({
    next: chunk => this.terminal.write(chunk),
    error: code => this.terminal.writeln(`The process errored with code: ${code}`)
  });

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
    this.buffer$$.unsubscribe();
    this.terminal.dispose();
  }
}
