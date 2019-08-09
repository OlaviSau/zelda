import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation
} from "@angular/core";

@Component({
  selector: "lx-tab",
  styleUrls: ["./tab.component.scss"],
  templateUrl: "./tab.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabComponent {}
