import { Process } from "./process";
import { IPty } from "node-pty-prebuilt-multiarch";
import { ReplaySubject } from "rxjs";

export class PtyProcess extends ReplaySubject<string> implements Process {

  constructor(private handle: IPty, readonly name = "") {
    super();
    this.handle.on("data", data => this.next(data));
    this.handle.on("exit", code => {
      if (code !== 0) {
        this.error(code);
      }
      this.complete();
    });
  }

  kill() {
    this.handle.kill();
  }
}
