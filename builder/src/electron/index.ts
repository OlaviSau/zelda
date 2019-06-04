import { createBuilder } from "@angular-devkit/architect";
import { executeBrowserBuilder } from "@angular-devkit/build-angular";
import { Schema as BrowserBuilderSchema } from "@angular-devkit/build-angular/src/browser/schema";
import { json } from "@angular-devkit/core";

export default createBuilder<BrowserBuilderSchema & json.JsonObject>((options, context) => executeBrowserBuilder(options, context, {
  webpackConfiguration: (configuration) => ({
    ...configuration,
    ...{
      target: "electron-renderer",
      externals: (ctx: any, req: any, done: any) => (/^node-pty-prebuilt-multiarch$/.test(req) ? done(null, `commonjs ${req}`) : done())
    }
  })
}));
