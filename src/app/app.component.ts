import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild} from "@angular/core";
import {Process} from "./app.model";
import {IPty} from "node-pty";
import {TerminalComponent} from "./terminal/terminal.component";
import {ConfigService} from "./config/config.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy {

  @ViewChild("terminal") terminal: TerminalComponent;

  private activePID = null;
  processes: Process[] = [];

  constructor(public config: ConfigService) {}

  listen(pty: IPty) {
    const process = {
      pty,
      buffer: [],
      name: pty.process
    };
    pty.on("data", data => this.update(process, data));
    pty.on("exit", code => this.update(process, `Process exited with code: ${code}`));

    this.processes = [...this.processes, process];
  }

  renderTerminal(process: Process | undefined) {
    this.terminal.reset();
    if (process) {
      this.activePID = process.pty.pid;
      for (const buffer of process.buffer) {
        this.terminal.write(buffer);
      }
    }
  }

  kill(pty) {
    const nextProcessIndex = this.processes.findIndex(process => process.pty.pid === pty.pid) + 1;
    this.renderTerminal(this.processes[nextProcessIndex]);
    this.processes = this.processes.filter(process => process.pty.pid !== pty.pid);
    pty.kill();
  }

  ngOnDestroy() {
    for (const process of this.processes) {
      process.pty.kill();
    }
  }

  private update(process: Process, chunk: string) {
    process.buffer.push(chunk);
    if (this.activePID === process.pty.pid) {
      this.terminal.write(chunk);
    }
  }
}
