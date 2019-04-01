import { BrowserBuilderSchema, DevServerBuilder } from "@angular-devkit/build-angular";
import { Path, virtualFs } from "@angular-devkit/core";
import { Stats } from "fs";

export class ElectronDevServer extends DevServerBuilder {
  buildWebpackConfig(root: Path, projectRoot: Path, host: virtualFs.Host<Stats>, browserOptions: BrowserBuilderSchema) {
    return {
      ...super.buildWebpackConfig(root, projectRoot, host, browserOptions),
      ...{
        target: "electron-renderer",
        externals: (ctx: any, req: any, done: any) => (/^node-pty$/.test(req) ? done(null, `commonjs ${req}`) : done())
      }
    };
  }
}
export default ElectronDevServer;
