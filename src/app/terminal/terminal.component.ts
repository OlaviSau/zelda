import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from "@angular/core";

import { Terminal } from "xterm";
import { debounce } from "../util/debounce";
import { ProcessState } from "../process/process.state";
import { Process } from "../process/process";
import { EMPTY, Subject } from "rxjs";
import { startWith, switchMap, tap } from "rxjs/operators";

@Component({
  selector: "app-terminal",
  templateUrl: "./terminal.component.html"
})
export class TerminalComponent implements OnDestroy, AfterViewInit {

  constructor(public processState: ProcessState) {
    this.terminal.onSelectionChange(() => document.execCommand("copy"));
  }
  @ViewChild("container", {read: ElementRef, static: true}) container;

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
    switchMap(process => {
      this.terminal.reset();
      return process ? process.buffer$ : EMPTY;
    }),
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
