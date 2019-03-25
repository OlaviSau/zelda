import { AfterViewInit, Component, ElementRef, Input, ViewChild} from "@angular/core";

import { IPty} from "node-pty";
import { Terminal } from "xterm";

@Component({
  selector: "app-terminal",
  templateUrl: "./terminal.component.html"
})
export class TerminalComponent implements AfterViewInit {

  @Input() process: IPty;
  @ViewChild("terminal", {read: ElementRef}) container;

  private terminal;

  ngAfterViewInit() {
    this.terminal = new Terminal({
      cols: 260,
      rows: 60,
      fontSize: 12,
      theme: {
        background: "#1e1e1e"
      }
    });
    this.process.on("data", data => this.terminal.write(data));
    this.process.on("exit", code => this.terminal.write(`Process exited with code: ${code}`));
  }

  open() {
    if (!this.container.nativeElement.hasChildNodes()) {
      this.terminal.open(this.container.nativeElement);
    }
  }
}
