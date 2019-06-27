import { lstat } from "fs";

export function isLink(directory: string): Promise<boolean> {
  return new Promise(resolve => lstat(directory,
    (err, stats) => resolve((!err && stats.isSymbolicLink()))
  ));
}
