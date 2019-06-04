import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from "@angular/core";

import { Terminal } from "xterm";

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
    cols: Math.floor(window.innerWidth / 8),
    rows: 30,
    fontSize: 12,
    theme: {
      background: "#1e1e1e"
    },
    rightClickSelectsWord: true
  });

  @HostListener("window:resize")
  onResize() {
     this.terminal.resize(Math.floor(window.innerWidth / 8), 30);
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
