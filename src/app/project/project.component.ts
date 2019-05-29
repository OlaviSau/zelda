import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from "@angular/core";
import {existsSync, lstatSync, readFileSync} from "fs";
import {AngularProjectConfig, DependencyType, Project, ProjectType} from "../app.model";
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
  readonly DependencyType = DependencyType;
  readonly ProjectType = ProjectType;


  applications: string[] = [];
  selectedApplication: string;
  @Input() projectIndex: number;
  @Output() processCreated = new EventEmitter();
  @Output() killProcess = new EventEmitter();
  @ViewChild("projectConfiguring", {static: false}) projectConfiguring;

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
      } else {
        this.selectedApplication = this.applications[0];
      }
    }
    if (!this.project.type) {
      this.configuring = true;
    }
  }

  isPackageLinked(link) {
    const path = `${this.project.directory}/node_modules/${link.name}`;
    return existsSync(path) && lstatSync(path).isSymbolicLink();
  }

  link(link) {
    execSequential(
      () => this.npmCommand({
        cwd: link.directory,
        args: ["link"],
        name: `${link.name}: Link`
      }),
      () => exec(`rm -rf ${this.project.directory}/node_modules/${link.name}`),
      () => this.npmCommand({
        cwd: this.project.directory,
        args: ["link", link.name],
        name: `${this.project.name}: Link ${link.name}`
      })
    );
  }

  install() {
    this.npmCommand({
      cwd: this.project.directory,
      args: ["install"],
      name: `${this.project.name}: Install`
    });
  }

  build() {
    const timestamp = Date.now();
    for (const dependency of this.project.dependencies.filter(({type}) => type === DependencyType.Lerna)) {
      const ps = this.lernaService.packages[dependency.directory].filter(p => this.isPackageLinked(p));
      if (!ps.length) {
        continue;
      }

      execSequential(
        () => this.npmCommand({
          cwd: dependency.directory,
          args: ["run", "build", "--" ].concat(...ps.map(p => ["--scope", p.name])),
          name: `${this.project.name}: Build${ps.map(p => ` ${p.name}`)}`
        }),
        () => this.npmCommand({
          cwd: dependency.directory,
          args: ["run",
            "release",
            "--",
            "--skip-git",
            "--canary",
            `dev-zelda-${timestamp}`,
            "--npm-tag",
            `dev-zelda-${timestamp}`
          ].concat(...ps.map(p => ["--scope", p.name])),
          name: `${this.project.name}: Release${ps.map(p => ` ${p.name}`)}`
        })
      );
    }
  }

  start() {
    this.npmCommand({
      cwd: this.project.directory,
      args: ["run", "start", this.selectedApplication],
      name: this.project.name
    });
  }

  private npmCommand({cwd, args, name}: {
    cwd: string,
    args: string[],
    name?: string
  }) {
    return this.emitProcess(spawn(this.node, [this.npm, ...args], {cwd, name, cols: 114}));
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
