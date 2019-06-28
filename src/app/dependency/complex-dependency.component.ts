import {
  ChangeDetectionStrategy,
  Component, EventEmitter, HostBinding, Input, OnChanges, Output,
  ViewEncapsulation
} from "@angular/core";
import { combineLatest, Observable } from "rxjs";
import { Project } from "../project/project";
import { map } from "rxjs/operators";
import { PackageDependency } from "./package-dependency";
import { DependencyState } from "./dependency.state";
import { ComplexDependency } from "./complex-dependency";

@Component({
  selector: "app-complex-dependency",
  templateUrl: "./complex-dependency.component.html",
  styleUrls: ["./complex-dependency.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplexDependencyComponent implements OnChanges {
  @Input() dependency: ComplexDependency;
  @Input() project: Project;
  @HostBinding("class.closed") closed = true;

  linkedDependencies$: Observable<PackageDependency[]>;
  notLinkedDependencies$: Observable<PackageDependency[]>;

  ngOnChanges() {
    this.linkedDependencies$ = this.filterByStatus$(true);
    this.notLinkedDependencies$ = this.filterByStatus$(false);
  }

  private filterByStatus$(status: boolean) {
    return combineLatest(
      this.dependency.dependencies.map(packageDependency => packageDependency.isLinked$(this.project))
    ).pipe(
      map(isLinked => this.dependency.dependencies.filter((item, index) => isLinked[index] === status))
    );
  }
}
