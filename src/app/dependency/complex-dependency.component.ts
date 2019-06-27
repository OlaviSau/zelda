import {
  ChangeDetectionStrategy,
  Component, EventEmitter, Input, OnChanges, Output,
  ViewEncapsulation
} from "@angular/core";
import { combineLatest, Observable } from "rxjs";
import { Project } from "../project/project";
import { map } from "rxjs/operators";
import { PackageDependency } from "./package-dependency";

@Component({
  selector: "app-complex-dependency",
  templateUrl: "./complex-dependency.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplexDependencyComponent implements OnChanges {
  @Input() dependencies: PackageDependency[];
  @Input() project: Project;
  @Input() name: string;
  @Output() link = new EventEmitter<PackageDependency>();

  linkedDependencies$: Observable<PackageDependency[]>;
  notLinkedDependencies$: Observable<PackageDependency[]>;

  ngOnChanges() {
    this.linkedDependencies$ = this.filterByStatus$(true);
    this.notLinkedDependencies$ = this.filterByStatus$(false);
  }

  private filterByStatus$(status: boolean) {
    return combineLatest(
      this.dependencies.map(packageDependency => packageDependency.isLinked$(this.project))
    ).pipe(
      map(isLinked => this.dependencies.filter((item, index) => isLinked[index] === status))
    );
  }
}
