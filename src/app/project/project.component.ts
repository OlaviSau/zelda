import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {existsSync, lstatSync, readFileSync} from "fs";
import {DependencyType, Project, ProjectConfig} from "../app.model";
import {IPty, spawn} from "node-pty";
import {LernaService} from "../lerna/lerna.service";
import {stripComments} from "tslint/lib/utils";
import {ConfigService} from "../config/config.service";
import {execSequential} from "../util/exec-sequential";
import {exec} from "child_process";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectComponent implements OnInit {

  constructor(
    private changeDetector: ChangeDetectorRef,
    public lernaService: LernaService,
    private config: ConfigService
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
    execSequential(
      () => this.emitProcess(exec(`rm -rf ${this.project.directory}/node_modules`)),
      () => this.npmCommand(this.project.directory, "install")
    );
  }

  start(application) {
    execSequential(
      () => this.npmCommand(this.project.directory, "run", "build:server", "--project", application),
      () => this.serveProcess = this.npmCommand(this.project.directory, "run", "start", application)
    );
  }

  stop() {
    this.killProcess.emit(this.serveProcess);
    this.serveProcess = undefined;
  }

  private npmCommand(cwd, ...args) {
   return this.emitProcess(spawn(this.node, [this.npm, ...args], { cwd, cols: 114, name: `npm ${args.join(" ")}` }));
  }

  get node() {
    return this.config.paths.node;
  }

  get npm() {
    return this.config.paths.npm;
  }

  private emitProcess(process: any) {
    this.processCreated.emit(process);
    return process;
  }
}
