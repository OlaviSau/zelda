import {
  ChangeDetectionStrategy,
  Component, HostBinding,
  ViewEncapsulation
} from "@angular/core";
import { ProjectState } from "./project.state";
import { ConfigComponent } from "../config/config.component";
import { MatDialog } from "@angular/material";

@Component({
  selector: "lx-project-tabs",
  styleUrls: ["./project-tabs.component.scss"],
  templateUrl: "./project-tabs.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTabsComponent {
  @HostBinding("class.tabs") cssClass = true;

  constructor(public projectState: ProjectState, private dialog: MatDialog) {}

  openConfig() {
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
