import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import {existsSync, lstatSync, readFileSync} from "fs";
import {DependencyType, Project, AngularProjectConfig, ProjectType} from "../app.model";
import {spawn} from "node-pty";
import {LernaService} from "../lerna/lerna.service";
import {stripComments} from "tslint/lib/utils";
import {ConfigService} from "../config/config.service";
import {execSequential} from "../util/exec-sequential";
import {exec} from "child_process";

@Component({
  selector: "app-project",
  styleUrls: ["./project.component.scss"],
  templateUrl: "./project.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ProjectComponent implements OnInit {

  constructor(
    private changeDetector: ChangeDetectorRef,
    public lernaService: LernaService,
    private config: ConfigService
  ) {
  }

  project: Project;
  configuring = false;
  DependencyType = DependencyType;


  applications: string[] = [];
  selectedApplication: string;
  @Input() projectIndex: number;
  @Output() processCreated = new EventEmitter();
  @Output() killProcess = new EventEmitter();
  @ViewChild("projectConfiguring") projectConfiguring;

  ngOnInit() {
    this.project = this.config.projects[this.projectIndex];
    if (this.project.type === ProjectType.Angular) {
      const projectConfig: AngularProjectConfig = JSON.parse(stripComments(
        readFileSync(`${this.project.directory}/angular.json`, {encoding: "utf8"})
      ));

      for (const projectName of Object.getOwnPropertyNames(projectConfig.projects)) {
        this.applications.push(projectName);
      }

      if (projectConfig.defaultProject) {
        this.selectedApplication = projectConfig.defaultProject;
      }
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

  push() {
    execSequential(
      () => this.emitProcess(exec(`rm -rf ${this.project.directory}/node_modules`)),
      () => this.npmCommand(this.project.directory, "install")
    );
  }

  start() {
    this.npmCommand(this.project.directory, "run", "start", this.selectedApplication);
  }

  private npmCommand(cwd, ...args) {
    return this.emitProcess(spawn(this.node, [this.npm, ...args], {cwd, cols: 114, name: `npm ${args.join(" ")}`}));
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
