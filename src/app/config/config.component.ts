import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {DependencyType, Project, ProjectType} from "../app.model";
import {ConfigForm} from "./config.form";
@Component({
  selector: "app-config",
  templateUrl: "./config.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ConfigComponent implements OnInit {

  @Input() project: Project;

  form: ConfigForm;
  ProjectType = ProjectType;
  DependencyType = DependencyType;

  ngOnInit() {
    this.form = new ConfigForm(this.project);
  }
}
