import { AfterViewInit, Component, ElementRef, Input, ViewChild} from "@angular/core";

import { IPty} from "node-pty";
import { Terminal } from "xterm";
import {buffer} from "rxjs/operators";

@Component({
  selector: "app-terminal",
  templateUrl: "./terminal.component.html"
})
export class TerminalComponent implements AfterViewInit {
  @ViewChild("container", {read: ElementRef}) container;

  terminal = new Terminal({
    cols: 260,
    rows: 56,
    fontSize: 12,
    theme: {
      background: "#1e1e1e"
    }
  });

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
