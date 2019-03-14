import { Component, OnInit} from "@angular/core";
import * as fs from "fs";
import {Project} from "./app.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

  config: {
    projects: Project[]
  } = null;

  ngOnInit() {
    this.config = JSON.parse(fs.readFileSync("config.json", {encoding: "utf8"}));
  }
}
