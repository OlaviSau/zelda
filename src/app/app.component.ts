import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { Config } from "./config/config";
import { ProjectState } from "./project/project.state";
@Component({
  selector: "lx-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(config: Config, projectState: ProjectState) {
    config.read().then(
      state => projectState.next({
        ...state,
        selected: state.projects[0]
      })
    );
  }
}
