import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
@Component({
  selector: "lx-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {}
