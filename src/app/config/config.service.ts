import {Injectable} from "@angular/core";
import {Config} from "../app.model";
import {existsSync, readFileSync} from "fs";
import {LernaService} from "../lerna/lerna.service";

@Injectable()
export class ConfigService {
  public config: Config;

  public exampleConfig = `
    {
      "projects": [
        {
          "name": "Mobile",
          "dependencies": [
            {
              "directory": "C:/directory/",
              "name": "@scope/example"
            }
          ]
        }
    }
  `;

  constructor(
    private lernaService: LernaService
  ) {
    if (existsSync("config.json")) {
      this.config = JSON.parse(readFileSync("config.json", {encoding: "utf8"}));
      this.lernaService.addConfig(this.config);
    }
  }
}
