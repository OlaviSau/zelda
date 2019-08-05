import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  ViewContainerRef,
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

  @HostListener("mousewheel", ["$event"]) scroll(event: WheelEvent) {
    const host = this.host.element.nativeElement as HTMLElement;
    host.scrollBy({
      left: +event.deltaY
    });
  }

  constructor(
    public projectState: ProjectState,
    private dialog: MatDialog,
    private host: ViewContainerRef
  ) {}

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
