import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation
} from "@angular/core";
import { ProjectState } from "./project.state";
import { map } from "rxjs/operators";
import { DependencyType } from "../dependency/dependency";

@Component({
  selector: "lx-project",
  styleUrls: ["./project.component.scss"],
  templateUrl: "./project.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectComponent {

  constructor(public projectState: ProjectState) {}

  complexDependencies$ = this.projectState.selected$.pipe(
    map(project => project ? project.dependencies.filter(
      dependency => [DependencyType.Lerna].includes(dependency.type)
    ) : [])
  );
  packageDependencies$ = this.projectState.selected$.pipe(
    map(project => project ? project.dependencies.filter(
      dependency => [DependencyType.Package].includes(dependency.type)
    ) : [])
  );
}
