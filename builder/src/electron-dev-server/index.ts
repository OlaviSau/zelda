import { createBuilder } from "@angular-devkit/architect";
import { DevServerBuilderOptions, executeDevServerBuilder } from "@angular-devkit/build-angular";

export default createBuilder<DevServerBuilderOptions>((options, context) => executeDevServerBuilder(options, context, {
  webpackConfiguration: (configuration) => ({
    ...configuration,
    ...{
      target: "electron-renderer",
      externals: (ctx: any, req: any, done: any) => (
        /^node-pty-prebuilt-multiarch$/.test(req) ? done(null, `commonjs ${req}`) : done()
      )
    }
  })
}));
