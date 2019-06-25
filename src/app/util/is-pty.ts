import { IPty } from "node-pty-prebuilt-multiarch";
import { ChildProcess } from "child_process";

export function isPty(handle: IPty | ChildProcess): handle is IPty {
  return typeof (<IPty>handle).resize === "function";
}
