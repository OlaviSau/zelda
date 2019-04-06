import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from "@angular/core";
import { existsSync, lstatSync } from "fs";
import {DependencyType, Project} from "../app.model";
import { IPty, spawn } from "node-pty";
import {LernaService} from "../lerna/lerna.service";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html"
})
export class ProjectComponent {

  constructor(
    private changeDetection: ChangeDetectorRef,
    public lernaService: LernaService
  ) {}

  private npmPath = "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js";
  private nodePath = "C:\\Program Files\\nodejs\\node.exe";
  @Output() process = new EventEmitter();

  serveProcess: IPty | undefined = undefined;
  DependencyType = DependencyType;

  @Input() project: Project;

  isPackageLinked(link) {
    const path = `${this.project.directory}/node_modules/${link.name}`;
    return existsSync(path) && lstatSync(path).isSymbolicLink();
  }

  link(link) {
    this.npmCommand(link.directory, "link").on("exit",
      () => {
        this.pause().on("exit",
          () => this.npmCommand(this.project.directory, "link", `${link.name}`).on("exit", () => this.resume())
        );
      }
    );
  }

  pause() {
    return {
      on(event: "exit", cb) {
        cb();
      }
    } as any;
  }

  resume() {
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
