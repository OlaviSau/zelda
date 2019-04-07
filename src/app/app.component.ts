import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild} from "@angular/core";
import {Process, ProcessStatus} from "./app.model";
import {exec} from "child_process";
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

  constructor(
    private changeDetector: ChangeDetectorRef,
    public configService: ConfigService
  ) {}

  exampleConfig = `
    {
      "projects": [
        {
          "name": "Mobile",
          "dependencies": [
            {
              "directory": "C:/directory/",
              "name": "@scope/example"
            }
          ]
        }
    }
  `;

  listen(pty: IPty) {
    const process = {
      pty,
      buffer: [],
      name: pty.process,
      status: ProcessStatus.Active
    };
    pty.on("data", data => this.update(process, data));
    pty.on("exit", code => this.update(process, `Process exited with code: ${code}`));

    this.processes.push(process);
  }

  renderTerminal(process) {
    this.terminal.reset();
    if (process) {
      this.activePID = process.pty.pid;
      for (const buffer of process.buffer) {
        this.terminal.write(buffer);
      }
    }
  }

  suspend(process) {
    this.getChildrenProcesses(process.pty.pid, lines => {
      for (const [executable, pid] of lines.map(line => line.split(/\s+/))) {
        if (executable === this.configService.config.paths.cmd) {
         this.getChildrenProcesses(pid, child => {
           for (const line of child) {
             exec(`pssuspend ${line.match(/\d+/)[0]}`, err => {
               if (!err) {
                 process.status = ProcessStatus.Suspended;
                 this.changeDetector.detectChanges();
               }
             });
           }
         });
        }
      }
    });
  }

  resume(process) {
    if (process.status !== ProcessStatus.Killed) {
      this.getChildrenProcesses(process.pty.pid, lines => {
        for (const [executable, pid] of lines.map(line => line.split(/\s+/))) {
          if (executable === this.configService.config.paths.cmd) {
            this.getChildrenProcesses(pid, child => {
              for (const line of child) {
                exec(`pssuspend -r ${line.match(/\d+/)[0]}`, err => {
                  if (!err) {
                    process.status = ProcessStatus.Active;
                    this.changeDetector.detectChanges();
                  }
                });
              }
            });
          }
        }
      });
    }
  }

  kill(pty) {
    this.processes = this.processes.filter(p => p.pty.pid !== pty.pid);
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

  private getChildrenProcesses(pid, fn) {
    exec(`wmic process where (ParentProcessId=${pid}) get ExecutablePath, ProcessId`, (err, data) => fn(this.parseWMIC(data)));
  }

  private parseWMIC(data) {
    return data.match(/[^\r\n]+/g).splice(1);
  }
}
