/// <reference types="node" />
import { BrowserBuilderSchema, DevServerBuilder } from "@angular-devkit/build-angular";
import { Path, virtualFs } from "@angular-devkit/core";
import { Stats } from "fs";
export declare class ElectronDevServer extends DevServerBuilder {
    buildWebpackConfig(root: Path, projectRoot: Path, host: virtualFs.Host<Stats>, browserOptions: BrowserBuilderSchema): any;
}
export default ElectronDevServer;
