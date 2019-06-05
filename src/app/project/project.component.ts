import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { FSWatcher, lstat, readFile, watch } from "fs";
import { AngularProjectConfig, DependencyType, Project, ProjectType } from "../app.model";
import { spawn } from "node-pty-prebuilt-multiarch";
import { LernaService } from "../lerna/lerna.service";
import { stripComments } from "tslint/lib/utils";
import { ConfigService } from "../config/config.service";
import { execSequential } from "../util/exec-sequential";
import { exec } from "child_process";
import { MatSnackBar } from "@angular/material";
import { BehaviorSubject } from "rxjs";
import { switchMap, tap } from "rxjs/operators";

const { keys } = Object;

@Component({
  selector: "app-project",
  styleUrls: ["./project.component.scss"],
  templateUrl: "./project.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectComponent implements OnInit, OnDestroy {

  constructor(
    private changeDetector: ChangeDetectorRef,
    public lernaService: LernaService,
    private config: ConfigService,
    private snackBar: MatSnackBar
  ) {
  }

  get node() {
    return this.config.paths.node;
  }

  get npm() {
    return this.config.paths.npm;
  }

  project: Project;
  configuring = false;
  projectWatcher: FSWatcher | undefined;
  projectWatcherSubject$ = new BehaviorSubject("initialize");
  moduleWatchers$ = {};
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
    this.projectWatcher = watch(this.project.directory, { recursive: true }, event => this.projectWatcherSubject$.next(event));
    if (this.project.type === ProjectType.Angular) {
        readFile(`${this.project.directory}/angular.json`, {encoding: "utf8"}, (err, data) => {
          if (err) {
            return this.snackBar.open(`angular.json could not be found`, "Dismiss");
          }
          const projectConfig: AngularProjectConfig = JSON.parse(stripComments(data));
          for (const projectName of keys(projectConfig.projects)) {
            this.applications.push(projectName);
          }
          const [defaultProject] = this.applications;

          if (projectConfig.defaultProject) {
            this.selectedApplication = projectConfig.defaultProject;
          } else {
            this.selectedApplication = defaultProject;
          }
          this.changeDetector.detectChanges();
        });
    } else if (!this.project.type) {
      this.configuring = true;
    }
  }

  isPackageLinked(link) {
    if (!this.moduleWatchers$[link.name]) {
      this.moduleWatchers$[link.name] = this.projectWatcherSubject$.pipe(
        switchMap(() => new Promise(resolve => lstat(`${this.project.directory}/node_modules/${link.name}`,
          (err, stats) =>  resolve(err ? false : stats.isSymbolicLink())
        ))),
        tap(() => this.changeDetector.detectChanges())
      );
    }
    return this.moduleWatchers$[link.name];
  }

  ngOnDestroy() {
    if (this.projectWatcher) {
      this.projectWatcher.close();
    }
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
    return this.emitProcess(spawn(this.node, [this.npm, ...args], {cwd, name, cols: window.innerWidth / 7}));
  }

  private emitProcess(process: any) {
    this.processCreated.emit(process);
    return process;
  }
}
