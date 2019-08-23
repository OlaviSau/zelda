import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { Config } from "./config/config";
import { ProjectState } from "./project/project.state";
import { ConfigComponent } from "./config/config.component";
import { MatDialog } from "@angular/material";
import { Project } from "./project/project";

@Component({
  selector: "lx-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(config: Config, public projectState: ProjectState, private dialog: MatDialog) {
    config
      .read()
      .then(state => projectState.next({
        projects: state.projects.map(project => ({
          terminal: {
            rows: 30
          },
          ...project
        })),
        selected: state.projects[0]
      }))
      .catch(() => projectState.next({projects: []}));
  }

  openConfig(project?: Project) {
    this.projectState.select(project);
    this.dialog.open(ConfigComponent, {
      maxHeight: "100vh",
      maxWidth: "100vw",
      height: "100vh",
      width: "100vw",
      hasBackdrop: false,
      panelClass: "slide"
    });
  }
}
