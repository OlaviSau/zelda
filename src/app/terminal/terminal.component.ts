import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from "@angular/core";

import { IPty} from "node-pty";
import { Terminal } from "xterm";
import {buffer} from "rxjs/operators";

@Component({
  selector: "app-terminal",
  templateUrl: "./terminal.component.html"
})
export class TerminalComponent implements AfterViewInit {

  constructor() {
    this.terminal.on("blur", () => document.execCommand("copy"));
  }
  @ViewChild("container", {read: ElementRef, static: true}) container;

  terminal = new Terminal({
    cols: Math.floor(window.innerWidth / 7),
    rows: 40,
    fontSize: 12,
    theme: {
      background: "#1e1e1e"
    },
    rightClickSelectsWord: true
  });

  @HostListener("window:resize")
  onResize() {
     this.terminal.resize(Math.floor(window.innerWidth / 7), 40);
  }

  isTerminalOpen() {
    return !!this.container.nativeElement.hasChildNodes();
  }

  write(chunk) {
    this.terminal.write(chunk);
  }

  reset() {
    this.terminal.reset();
  }

  ngAfterViewInit() {
    if (!this.isTerminalOpen()) {
      this.terminal.open(this.container.nativeElement);
    }
  }
}
