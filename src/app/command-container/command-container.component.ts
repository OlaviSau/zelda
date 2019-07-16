import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from "@angular/core";
import { ProjectState } from "../project/project.state";
import { map } from "rxjs/operators";
import { AngularProjectSelectorComponent } from "../project/angular/angular-project-selector.component";
import { ProcessService } from "../process/process.service";

@Component({
  selector: "lx-command-container",
  templateUrl: "./command-container.component.html",
  styleUrls: ["./command-container.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CommandContainerComponent implements OnDestroy {
  constructor(
    private projectState: ProjectState,
    public processService: ProcessService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  @ViewChild("specifics", { read: ViewContainerRef, static: true }) specifics: ViewContainerRef | undefined;

  commands$ = this.projectState.selected$.pipe(map(project => project ? project.commands : []));
  project$$ = this.projectState.selected$.subscribe(
    project => {
      if (this.specifics) {
        this.specifics.clear();
        if (project) {
          for (const component of [AngularProjectSelectorComponent]) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
            this.specifics.createComponent(componentFactory);
          }
        }
      }
    }
  );

  ngOnDestroy() {
    this.project$$.unsubscribe();
  }
}
