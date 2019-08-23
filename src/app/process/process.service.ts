import { Injectable, OnDestroy } from "@angular/core";
import { fromEvent } from "rxjs";
import { SequentialCommand } from "./sequential.command";
import { ProcessState } from "./process.state";
import { ProjectState } from "../project/project.state";
import { Command } from "./command";
import { Process } from "./process";

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
  ) {
  }

  private queued?: Command[];
  private resolveQue?: (process: Process) => void;

  private queueCommands$$ = fromEvent(document, "keydown").subscribe(
    (event: KeyboardEvent) => event.shiftKey && !this.queued ? this.queued = [] : undefined
  );

  private executeCommands$$ = fromEvent(document, "keyup").subscribe((event: MouseEvent) => {
    if (!event.shiftKey) {
      if (this.queued && this.queued.length && this.resolveQue) {
        const process = new SequentialCommand(
          this.queued,
          this.queued.map(command => this.replace(command.name || "")).join(" && ")
        ).execute(this.rows, this.replacements);
        this.processState.add(process);
        this.resolveQue(process);
      }
      this.resolveQue = undefined;
      this.queued = undefined;
    }
  });

  private rows = 30;
  private replacements = {
    "<project.directory>": "",
    "<project.name>": "",
    "<angular.project>": ""
  };
  private project$$ = this.projectState.selected$.subscribe(
    (project = {name: "", directory: "", commands: [], dependencies: [], terminal: { rows: 30 }}) => {
      this.replacements["<project.directory>"] = project.directory;
      this.replacements["<project.name>"] = project.name;
      this.rows = project.terminal.rows;
    }
  );

  isQueued(command: Command) {
    return !!this.queued && !!this.queued.find(que => que === command);
  }

  execute(command: Command): Promise<Process> {
    if (!this.queued) {
      const process = command.execute(this.rows, this.replacements);
      this.processState.add(process);
      return Promise.resolve(process);
    }
    this.queued = [...this.queued, command];

    return new Promise<Process>(resolve => this.resolveQue = resolve);
  }

  ngOnDestroy() {
    this.queueCommands$$.unsubscribe();
    this.executeCommands$$.unsubscribe();
    this.project$$.unsubscribe();
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
