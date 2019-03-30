import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import { readFileSync } from "fs";
import {Process, ProcessStatus, Project} from "./app.model";
import { exec } from "child_process";
import {IPty} from "node-pty";
import {TerminalComponent} from "./terminal/terminal.component";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
  })
  export class AppComponent implements OnInit, OnDestroy {

  @ViewChild("terminal") terminal: TerminalComponent;

  private activePID = null;
  processes: Process[] = [];

  constructor(private changeDetector: ChangeDetectorRef) {}

  config: {
    projects: Project[],
    suspendPath: "C:\\bin\\pssuspend.exe",
    cmdPath: "C:\\WINDOWS\\system32\\cmd.exe"
  } = null;

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
        if (executable === this.config.cmdPath) {
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
          if (executable === this.config.cmdPath) {
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

  kill(process) {
    this.processes = this.processes.filter(p => p !== process);
    process.pty.kill();
    process.status = ProcessStatus.Killed;
  }

  ngOnDestroy() {
    for (const process of this.processes) {
      process.pty.kill();
    }
  }

  ngOnInit() {
    this.config = JSON.parse(readFileSync("config.json", {encoding: "utf8"}));
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
