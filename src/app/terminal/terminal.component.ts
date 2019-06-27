import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from "@angular/core";

import { Terminal } from "xterm";
import { debounce } from "../util/debounce";
import { ProcessState } from "../process/process.state";
import { catchError, finalize, switchMap, tap } from "rxjs/operators";
import { ignoreNil } from "../util/ignore-nil";
import { EMPTY } from "rxjs";

@Component({
  selector: "app-terminal",
  templateUrl: "./terminal.component.html"
})
export class TerminalComponent implements OnDestroy, AfterViewInit {

  constructor(public processState: ProcessState) {
    this.terminal.on("blur", () => document.execCommand("copy"));
  }
  @ViewChild("container", {read: ElementRef, static: true}) container: ElementRef;

  terminal = new Terminal({
    cols: Math.floor(window.innerWidth / 7),
    rows: 30,
    fontSize: 12,
    theme: {
      background: "#1e1e1e"
    },
    rightClickSelectsWord: true,
    windowsMode: true
  });

  private buffer$$ = this.processState.selected$.pipe(
    tap(() => this.terminal.reset()),
    ignoreNil(),
    switchMap(process => process.buffer$.pipe(
      finalize(() => this.terminal.writeln(`The process has exited with code 0`)),
      catchError(code => {
        this.terminal.writeln(`The process has errored with code ${code}`);
        return EMPTY;
      })
    ))
  ).subscribe(chunk => this.terminal.write(chunk));

  ngOnDestroy() {
    this.buffer$$.unsubscribe();
  }

  ngAfterViewInit() {
    this.terminal.open(this.container.nativeElement);
  }

  @HostListener("window:resize")
  @debounce()
  onResize() {
     this.terminal.resize(Math.floor(window.innerWidth / 7), 30);
  }
}
