import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from "@angular/core";
import { existsSync, lstatSync } from "fs";
import { Project} from "../app.model";
import { IPty, spawn } from "node-pty";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html"
})
export class ProjectComponent {

  constructor(private changeDetection: ChangeDetectorRef) {}

  private npmPath = "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js";
  private nodePath = "C:\\Program Files\\nodejs\\node.exe";
  @Output() process = new EventEmitter();

  serveProcess: IPty | undefined = undefined;
  serveProcessNodePID = null;

  @Input() project: Project;

  isPackageLinked(link) {
    const path = `${this.project.directory}\\node_modules\\@${link.scope}\\${link.name}`;
    return existsSync(path) && lstatSync(path).isSymbolicLink();
  }

  link(link) {
    this.npmCommand(link.directory, "link").on("exit",
      () => {
        this.pause().on("exit",
          () => this.npmCommand(this.project.directory, "link", `@${link.scope}/${link.name}`).on("exit", () => this.resume())
        );
      }
    );
  }

  pause() {
    // if (this.serveProcess) {
    //   return spawn(this.suspendPath, [String(this.serveProcessNodePID)], {});
    // }
    return {
      on(event: "exit", cb) {
        cb();
      }
    } as any;
  }

  resume() {
    // if (this.serveProcess) {
    //   spawn(this.suspendPath, ["-r", String(this.serveProcessNodePID)], {});
    // }
  }

  install() {
    this.npmCommand(this.project.directory, "install");
  }

  clean() {
    this.process.emit(spawn("C:\\Program Files\\Git\\usr\\bin\\rm.exe", ["-rf", "node_modules"], {
        cwd: this.project.directory,
        cols: 260,
        name: `rm -rf node_modules`
    }));
    this.changeDetection.detectChanges();
  }

  start(application) {
    this.serveProcess = this.npmCommand(this.project.directory, "run", "start", application);
    // console.log(this.serveProcess.pid);
    // spawn(this.wmicPath, ["process", "where", `(ParentProcessId=${this.serveProcess.pid})`, "get", "ProcessId"], {})
    //   .on("data",
    //     cmdPID => {
    //       if (cmdPID === "nl") {
    //         spawn(
    //           this.wmicPath,
    //           ["process", "where", `(ParentProcessId=${"nl"})`, "get", "ProcessId"],
    //           {}
    //         ).on("data", pid => {
    //           const nodeParse = pid.match(/\d+/g);
    //           if (nodeParse[0] === "0" && nodeParse[1] === "25") {
    //             this.serveProcessNodePID = nodeParse[2];
    //             console.log(this.serveProcessNodePID);
    //           }
    //         });
    //       }
    //     }
    //   );
  }

  stop() {
    this.serveProcess.kill();
    this.serveProcess = undefined;
  }

  private npmCommand(cwd, ...args) {
    const process = spawn(this.nodePath, [this.npmPath, ...args], { cwd, cols: 260, name: `npm ${args.join(" ")}` });
    this.process.emit(process);
    this.changeDetection.detectChanges();
    return process;
  }
}
