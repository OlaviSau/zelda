import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { ProjectState } from "./project/project.state";
import { MatDialog } from "@angular/material";
import { ConfigComponent } from "./config/config.component";
@Component({
  selector: "lx-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(
    public projectState: ProjectState,
    private dialog: MatDialog
  ) {}



  openConfig() {
    this.dialog.open(ConfigComponent, {
      maxHeight: "100vh",
      maxWidth: "100vw",
      height: "100vh",
      width: "100vw"
    });
  }
}
