import {
  ChangeDetectionStrategy,
  Component, EventEmitter, HostBinding, HostListener, Input, OnChanges, OnDestroy, Output,
  ViewEncapsulation
} from "@angular/core";
import { combineLatest, Observable } from "rxjs";
import { Project } from "../project/project";
import { map } from "rxjs/operators";
import { PackageDependency } from "./package-dependency";
import { DependencyState } from "./dependency.state";

@Component({
  selector: "app-package-dependency",
  templateUrl: "./package-dependency.component.html",
  styleUrls: ["./package-dependency.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackageDependencyComponent {

  constructor(public dependencyState: DependencyState) {}
  @Input() dependency: PackageDependency;
  @Input() project: Project;

  @HostBinding("class.linking") linking = false;

  linking$ = this.dependencyState.linking$.pipe(
    map(links => this.linking = !!links.find(
      link => link.project === this.project && link.dependency === this.dependency
    )),
  );

  @HostListener("click") private link() {
    this.dependencyState.link({dependency: this.dependency, project: this.project});
  }
}
