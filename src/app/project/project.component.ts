import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {existsSync, lstatSync, readFileSync} from "fs";
import {DependencyType, Project, ProjectConfig} from "../app.model";
import { IPty, spawn } from "node-pty";
import {LernaService} from "../lerna/lerna.service";
import {stripComments} from "tslint/lib/utils";
import {ConfigService} from "../config/config.service";
import {execSequential} from "../util/exec-sequential";
import {exec} from "child_process";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html"
})
export class ProjectComponent implements OnInit {

  constructor(
    private changeDetection: ChangeDetectorRef,
    public lernaService: LernaService,
    private configService: ConfigService
  ) {}

  @Input() project: Project;
  @Output() processCreated = new EventEmitter();
  @Output() killProcess = new EventEmitter();

  DependencyType = DependencyType;

  serveProcess: IPty | undefined = undefined;
  applications: string[] = [];
  selectedApplication: string;

  ngOnInit() {
    const projectConfig: ProjectConfig = JSON.parse(stripComments(
      readFileSync(`${this.project.directory}/angular.json`, {encoding: "utf8"})
    ));

    if (projectConfig.defaultProject) {
      this.selectedApplication = projectConfig.defaultProject;
    }

    for (const projectName of Object.getOwnPropertyNames(projectConfig.projects)) {
      this.applications.push(projectName);
    }
  }

  isPackageLinked(link) {
    const path = `${this.project.directory}/node_modules/${link.name}`;
    return existsSync(path) && lstatSync(path).isSymbolicLink();
  }

  link(link) {
    execSequential(
      () => this.npmCommand(link.directory, "link"),
      () => exec(`rm -rf ${this.project.directory}/node_modules/${link.name}`),
      () => this.npmCommand(this.project.directory, "link", `${link.name}`)
    );
  }

  install() {
    this.npmCommand(this.project.directory, "install");
  }

  clean() {
    this.processCreated.emit(spawn("C:\\Program Files\\Git\\usr\\bin\\rm.exe", ["-rf", "node_modules"], {
        cwd: this.project.directory,
        cols: 114,
        name: `rm -rf node_modules`
    }));
    this.changeDetection.detectChanges();
  }

  start(application) {
    this.serveProcess = this.npmCommand(this.project.directory, "run", "start", application);
  }

  stop() {
    this.killProcess.emit(this.serveProcess);
    this.serveProcess = undefined;
  }

  private npmCommand(cwd, ...args) {
    const process = spawn(this.configService.config.paths.node, [
      this.configService.config.paths.npm, ...args
    ], { cwd, cols: 114, name: `npm ${args.join(" ")}` });
    this.processCreated.emit(process);
    this.changeDetection.detectChanges();
    return process;
  }
}
