import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { ConfigService } from "./config/config.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(public config: ConfigService) {}
}
