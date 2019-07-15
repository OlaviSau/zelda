import { Injectable, OnDestroy } from "@angular/core";
import { ProjectState } from "../project/project.state";
import { ProjectType } from "../project/project";

interface ReplacementDirectory {
  "<project.directory>": string;
  "<project.name>": string;
  "<angular.project>": string;
}

@Injectable()
export class ReplacementService implements OnDestroy {
  constructor(private projectState: ProjectState) {}

  private replacements: ReplacementDirectory = {
    "<project.directory>": "",
    "<project.name>": "",
    "<angular.project>": ""
  };
  private project$$ = this.projectState.selected$.subscribe(
    (project = {name: "", directory: "", type: ProjectType.Angular, commands: [], dependencies: []}) => {
      this.replacements["<project.directory>"] = project.directory;
      this.replacements["<project.name>"] = project.name;
    }
  );


  replace(segment: string) {
    for (const key in this.replacements) {
      segment = segment.replace(key, this.replacements[key as keyof ReplacementDirectory]);
    }
    return segment;
  }

  setReplacement(key: keyof ReplacementDirectory, value: string) {
    this.replacements[key] = value;
  }

  ngOnDestroy() {
    this.project$$.unsubscribe();
  }

}
