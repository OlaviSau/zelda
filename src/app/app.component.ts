import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import { readFileSync, watchFile } from "fs";
import {Project} from "./app.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

  constructor(private changeDetector: ChangeDetectorRef) {}

  config: {
    projects: Project[]
  } = null;

  ngOnInit() {
    this.config = JSON.parse(readFileSync("config.json", {encoding: "utf8"}));
    watchFile("config.json", () => {
      this.config = JSON.parse(readFileSync("config.json", {encoding: "utf8"}));
      this.changeDetector.markForCheck();
    });
  }
}
