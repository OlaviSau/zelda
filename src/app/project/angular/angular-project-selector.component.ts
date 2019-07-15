import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation
} from "@angular/core";
import { ProjectState } from "../project.state";
import { switchMap } from "rxjs/operators";
import { Project } from "../project";
import { readFile } from "fs";
import { stripComments } from "tslint/lib/utils";
import { FormControl } from "@angular/forms";
import { ReplacementService } from "../../command-container/replacement.service";

interface AngularConfig {
  projects: {
    [key: string]: any
  };
  defaultProject?: string;
}

@Component({
  selector: "lx-angular-project-selector",
  templateUrl: "./angular-project-selector.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AngularProjectSelectorComponent {

  constructor(
    public projectState: ProjectState,
    private changeDetector: ChangeDetectorRef,
    private replacementService: ReplacementService
  ) {
    this.projectControl = new FormControl("");
    this.projectControl.registerOnChange((value: string) => this.replacementService.setReplacement("<angular.project>", value));
  }

  projectControl: FormControl;
  projects$ = this.projectState.selected$.pipe(
    switchMap((project: Project) => new Promise(resolve => {
      readFile(`${project.directory}/angular.json`, {encoding: "utf8"}, (err, data) => {
        if (err) {
          return;
        }
        const angularConfig: AngularConfig = JSON.parse(stripComments(data));
        const projects = Object.keys(angularConfig.projects);
        const [defaultProject] = projects;

        this.projectControl.setValue(angularConfig.defaultProject || defaultProject);
        this.changeDetector.markForCheck();

        resolve(projects);
      });
    }))
  );
}
