import { Injectable, OnDestroy } from "@angular/core";
import { fromEvent } from "rxjs";
import { SequentialProcess } from "./sequential.process";
import { ProcessState } from "./process.state";
import { PtyProcess } from "./pty.process";
import { ProjectState } from "../project/project.state";
import { Process } from "./process";

export interface ProcessInstructions {
  name: string;
  directory: string;
  segments: string;
}

export interface SequentialProcessInstructions {
  commands: {
    directory: string;
    segments: string;
  }[];
  name: string;
}

interface ReplacementDirectory {
  "<project.directory>": string;
  "<project.name>": string;
  "<angular.project>": string;
}

@Injectable()
export class ProcessService implements OnDestroy {
  constructor(
    private processState: ProcessState,
    private projectState: ProjectState
  ) {}

  private queued?: {
    instructions: ProcessInstructions | SequentialProcessInstructions,
    resolve: (process: Process) => void
  }[];
  queueCommands$$ = fromEvent(document, "keydown").subscribe((event: MouseEvent) => {
    if (event.shiftKey && !this.queued) {
      this.queued = [];
    }
  });

  executeCommands$$ = fromEvent(document, "keyup").subscribe((event: MouseEvent) => {
    if (!event.shiftKey) {
      if (this.queued && this.queued.length) {
        this.processState.add(new SequentialProcess(
          this.queued.map(
            que => () => {
              let process: Process;
              if (!(que.instructions as SequentialProcessInstructions).commands) {
                process = this.createProcess(que.instructions as ProcessInstructions);
              } else {
                process = this.createSequentialProcess(que.instructions as SequentialProcessInstructions);
              }

              que.resolve(process);
              return process;
            }
          ),
          this.queued.map(que => this.replace(que.instructions.name)).join(" && ")
        ));
      }
      this.queued = undefined;
    }
  });

  private replacements = {
    "<project.directory>": "",
    "<project.name>": "",
    "<angular.project>": ""
  };
  private project$$ = this.projectState.selected$.subscribe(
    (project = {name: "", directory: "", commands: [], dependencies: []}) => {
      this.replacements["<project.directory>"] = project.directory;
      this.replacements["<project.name>"] = project.name;
    }
  );

  isQueued(command: ProcessInstructions | SequentialProcessInstructions) {
    return !!this.queued && !!this.queued.find(que => que.instructions === command);
  }

  execute(command: ProcessInstructions | SequentialProcessInstructions): Promise<Process> {
    return new Promise<Process>(
      resolve => {
        if (this.queued) {
          this.queued = [...this.queued, {
            instructions: command,
            resolve
          }];
        } else if (!(command as SequentialProcessInstructions).commands) {
          const process = this.createProcess(command as ProcessInstructions);
          this.processState.add(process);
          resolve(process);
        } else {
          const process = this.createSequentialProcess(command as SequentialProcessInstructions);
          this.processState.add(process);
          resolve(process);
        }
      }
    );
  }

  ngOnDestroy() {
    this.queueCommands$$.unsubscribe();
    this.executeCommands$$.unsubscribe();
    this.project$$.unsubscribe();
  }

  private createProcess(command: ProcessInstructions): Process {
    return new PtyProcess(
      this.replace(command.directory),
      this.replace(command.segments),
      this.replace(command.name)
    );
  }


  private createSequentialProcess(command: SequentialProcessInstructions): Process {
    return new SequentialProcess(
      command.commands.map(instructions => () => new PtyProcess(instructions.directory, instructions.segments)),
      command.name
    );
  }

  private replace(segment: string) {
    for (const key in this.replacements) {
      segment = segment.replace(key, this.replacements[key as keyof ReplacementDirectory]);
    }
    return segment;
  }

  setReplacement(key: keyof ReplacementDirectory, value: string) {
    this.replacements[key] = value;
  }
}
