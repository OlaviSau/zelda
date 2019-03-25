import {ChangeDetectorRef, Component, Input} from "@angular/core";
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
  processes: IPty[] = [];

  @Input() project: Project;

  isPackageLinked(link) {
    const path = `${this.project.directory}\\node_modules\\@${link.scope}\\${link.name}`;
    return existsSync(path) && lstatSync(path).isSymbolicLink();
  }

  link(link) {
    this.npmCommand(link.directory, "link").on("exit",
      () => this.npmCommand(this.project.directory, "link", `@${link.scope}/${link.name}`)
    );
  }

  install() {
    this.npmCommand(this.project.directory, "install");
  }

  start(application) {
    this.npmCommand(this.project.directory, "run", "start", application);
  }

  private npmCommand(cwd, ...args) {
    const process = spawn(this.nodePath, [this.npmPath, ...args], { cwd, cols: 260, name: `npm ${args.join(" ")}` });
    this.processes.push(process);
    this.changeDetection.detectChanges();
    process.on("exit", exitCode => this.removeProcess(exitCode, process));
    return process;
  }

  removeProcess(exitCode, process) {
    if (exitCode === 0) {
      this.processes = this.processes.filter(existing => existing !== process);
    }
    this.changeDetection.markForCheck();
  }
}
