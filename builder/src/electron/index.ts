import { BrowserBuilder, NormalizedBrowserBuilderSchema } from "@angular-devkit/build-angular";
import { Path, virtualFs } from "@angular-devkit/core/src/virtual-fs";
import { Stats } from "fs";

export class ElectronBuilder extends BrowserBuilder {
  buildWebpackConfig(root: Path, projectRoot: Path, host: virtualFs.Host<Stats>, browserOptions: NormalizedBrowserBuilderSchema) {
    return {
      ...super.buildWebpackConfig(root, projectRoot, host, browserOptions),
      ...{ target: "electron-renderer", externals: ["node-pty"] }
    };
  }
}

export default ElectronBuilder;
