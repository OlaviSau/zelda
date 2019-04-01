/// <reference types="node" />
import { BrowserBuilder, NormalizedBrowserBuilderSchema } from "@angular-devkit/build-angular";
import { Path, virtualFs } from "@angular-devkit/core/src/virtual-fs";
import { Stats } from "fs";
export declare class ElectronBuilder extends BrowserBuilder {
    buildWebpackConfig(root: Path, projectRoot: Path, host: virtualFs.Host<Stats>, browserOptions: NormalizedBrowserBuilderSchema): any;
}
export default ElectronBuilder;
