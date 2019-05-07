"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const build_angular_1 = require("@angular-devkit/build-angular");
class ElectronBuilder extends build_angular_1.BrowserBuilder {
    buildWebpackConfig(root, projectRoot, host, browserOptions) {
        return Object.assign({}, super.buildWebpackConfig(root, projectRoot, host, browserOptions), {
            target: "electron-renderer",
            externals: (ctx, req, done) => (/^node-pty$/.test(req) ? done(null, `commonjs ${req}`) : done())
        });
    }
}
exports.ElectronBuilder = ElectronBuilder;
exports.default = ElectronBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInNyYy9lbGVjdHJvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlFQUErRjtBQUkvRixNQUFhLGVBQWdCLFNBQVEsOEJBQWM7SUFDakQsa0JBQWtCLENBQUMsSUFBVSxFQUFFLFdBQWlCLEVBQUUsSUFBMkIsRUFBRSxjQUE4QztRQUMzSCx5QkFDSyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsY0FBYyxDQUFDLEVBQ2pFO1lBQ0QsTUFBTSxFQUFFLG1CQUFtQjtZQUMzQixTQUFTLEVBQUUsQ0FBQyxHQUFRLEVBQUUsR0FBUSxFQUFFLElBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDaEgsRUFDRDtJQUNKLENBQUM7Q0FDRjtBQVZELDBDQVVDO0FBRUQsa0JBQWUsZUFBZSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQnJvd3NlckJ1aWxkZXIsIE5vcm1hbGl6ZWRCcm93c2VyQnVpbGRlclNjaGVtYSB9IGZyb20gXCJAYW5ndWxhci1kZXZraXQvYnVpbGQtYW5ndWxhclwiO1xyXG5pbXBvcnQgeyBQYXRoLCB2aXJ0dWFsRnMgfSBmcm9tIFwiQGFuZ3VsYXItZGV2a2l0L2NvcmUvc3JjL3ZpcnR1YWwtZnNcIjtcclxuaW1wb3J0IHsgU3RhdHMgfSBmcm9tIFwiZnNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFbGVjdHJvbkJ1aWxkZXIgZXh0ZW5kcyBCcm93c2VyQnVpbGRlciB7XHJcbiAgYnVpbGRXZWJwYWNrQ29uZmlnKHJvb3Q6IFBhdGgsIHByb2plY3RSb290OiBQYXRoLCBob3N0OiB2aXJ0dWFsRnMuSG9zdDxTdGF0cz4sIGJyb3dzZXJPcHRpb25zOiBOb3JtYWxpemVkQnJvd3NlckJ1aWxkZXJTY2hlbWEpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIC4uLnN1cGVyLmJ1aWxkV2VicGFja0NvbmZpZyhyb290LCBwcm9qZWN0Um9vdCwgaG9zdCwgYnJvd3Nlck9wdGlvbnMpLFxyXG4gICAgICAuLi57XHJcbiAgICAgICAgdGFyZ2V0OiBcImVsZWN0cm9uLXJlbmRlcmVyXCIsXHJcbiAgICAgICAgZXh0ZXJuYWxzOiAoY3R4OiBhbnksIHJlcTogYW55LCBkb25lOiBhbnkpID0+ICgvXm5vZGUtcHR5JC8udGVzdChyZXEpID8gZG9uZShudWxsLCBgY29tbW9uanMgJHtyZXF9YCkgOiBkb25lKCkpXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFbGVjdHJvbkJ1aWxkZXI7XHJcbiJdfQ==