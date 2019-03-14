import {ChangeDetectorRef, Component, Input, OnDestroy} from "@angular/core";
import {ChildProcess, spawn} from "child_process";
import {existsSync, lstatSync} from "fs";
import {DomSanitizer} from "@angular/platform-browser";
import * as ANSIToHtml from "ansi-html";
import {Project} from "../app.model";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html"
})
export class ProjectComponent implements OnDestroy {

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    public sanitizer: DomSanitizer
  ) {
  }
  private npmPath = "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js";

  @Input() project: Project;

  applicationRef: ChildProcess | undefined;
  installRef: ChildProcess | undefined;
  linkRefs: {[key: string]: ChildProcess | undefined} = {};
  output: string[] = [];

  isPackageLinked(link) {
    const path = `${this.project.directory}\\node_modules\\@${link.scope}\\${link.name}`;
    return existsSync(path) && lstatSync(path).isSymbolicLink();
  }

  onPackageChange(link) {
    this.linkRefs[link.name] = this.npmCommand(link.directory, "link");

    this.linkRefs[link.name].on("exit", () => {
      this.linkRefs[link.name] = this.npmCommand(this.project.directory, "link", `@${link.scope}/${link.name}`);
      this.linkRefs[link.name].on("exit", this.detect(() => this.linkRefs[link.name] = undefined));
    });
  }

  install() {
    this.installRef = this.npmCommand(this.project.directory, "install");
    this.installRef.on("exit", this.detect(() => this.installRef = undefined));
  }

  start(application) {
    this.logCommand(this.project.directory, `node ${this.project.directory}\\node_modules\\@angular\\cli\\bin\\ng serve ${application}`)
    this.applicationRef = spawn("node", [
      `${this.project.directory}\\node_modules\\@angular\\cli\\bin\\ng`,
      "serve",
      application
    ], {
      cwd: this.project.directory
    });

    this.logChildProcess(this.applicationRef);
  }

  stop() {
    if (this.applicationRef) {
      this.applicationRef.kill("SIGTERM");
      this.applicationRef = undefined;
    }
  }

  private detect(func: (...args) => void) {
    return (...args) => {
      func(...args);
      this.changeDetectionRef.detectChanges();
    };
  }

  private logCommand(cwd, command) {
    this.output.push(`${cwd} > ${command}`);
  }

  private npmCommand(cwd, ...args): ChildProcess {
    this.logCommand(cwd, `npm ${args.join(" ")}`);
    const child = spawn(`node`, [this.npmPath, ...args], {cwd});
    this.logChildProcess(child);
    return child;
  }

  private logChildProcess(child: ChildProcess) {
    const interval = setInterval(() => {
        if (child.killed) {
          return clearInterval(interval);
        }
        const err = child.stderr.read();
        if (err) {
          this.output.push(ANSIToHtml(err.toString()));
        }
        const out = child.stdout.read();
        if (out) {
          this.output.push(ANSIToHtml(out.toString()));
        }
      }, 200);

  }

  ngOnDestroy() {
    this.stop();
  }
}
