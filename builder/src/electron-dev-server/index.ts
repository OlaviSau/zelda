import { createBuilder } from "@angular-devkit/architect";
import { DevServerBuilderOptions, executeDevServerBuilder } from "@angular-devkit/build-angular";
import * as path from "path";

export default createBuilder<DevServerBuilderOptions>((options, context) => executeDevServerBuilder(options, context, {
  webpackConfiguration: (configuration) => ({
    ...configuration,
    ...{
      target: "electron-renderer",
      externals: (ctx: any, req: any, done: any) => (/^node-pty$/.test(req) ? done(
        null, `commonjs ${path.resolve(context.workspaceRoot, "./node-pty")}`
      ) : done())
    }
  })
}));
