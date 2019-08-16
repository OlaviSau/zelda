import { Injectable, OnDestroy } from "@angular/core";
import { fromEvent } from "rxjs";
import { SequentialProcess } from "./sequential.process";
import { ProcessState } from "./process.state";
import { ProjectState } from "../project/project.state";
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

  private queued?: Process[];

  private queueCommands$$ = fromEvent(document, "keydown").subscribe(
    (event: KeyboardEvent) => event.shiftKey && !this.queued ? this.queued = [] : undefined
  );

  executeCommands$$ = fromEvent(document, "keyup").subscribe((event: MouseEvent) => {
    if (!event.shiftKey) {
      if (this.queued && this.queued.length) {
        const sequentialProcess = new SequentialProcess(
          this.queued,
          this.queued.map(process => this.replace(process.name || "")).join(" && ")
        );
        sequentialProcess.execute(30, this.replacements);
        this.processState.add(sequentialProcess);
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

  isQueued(command: Process) {
    return !!this.queued && !!this.queued.find(que => que === command);
  }

  execute(process: Process) {
    if (!this.queued) {
      process.execute(30, this.replacements);
      this.processState.add(process);
      return;
    }
    this.queued = [...this.queued, process];
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
