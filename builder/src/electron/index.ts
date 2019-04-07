import { BrowserBuilder, NormalizedBrowserBuilderSchema } from "@angular-devkit/build-angular";
import { Path, virtualFs } from "@angular-devkit/core/src/virtual-fs";
import { Stats } from "fs";

export class ElectronBuilder extends BrowserBuilder {
  buildWebpackConfig(root: Path, projectRoot: Path, host: virtualFs.Host<Stats>, browserOptions: NormalizedBrowserBuilderSchema) {
    return {
      ...super.buildWebpackConfig(root, projectRoot, host, browserOptions),
      ...{
        target: "electron-renderer",
        externals: (ctx: any, req: any, done: any) => (/^node-pty$/.test(req) ? done(null, `commonjs ${req}`) : done())
      }
    };
  }
}

export default ElectronBuilder;
