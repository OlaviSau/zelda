import { writeFile } from "fs";
import readFile from "../util/async/read-file";

export class JsonFile<T> {
  constructor(private path: string, private options = { encoding: "utf8" }) {}

  static read<T>(path: string, options = { encoding: "utf8" }) {
    return new JsonFile<T>(path, options).read();
  }

  read(): Promise<T> {
    return readFile(this.path, this.options).then(content => JSON.parse(content));
  }

  write(value: T) {
    writeFile(this.path, JSON.stringify(value, null, 2), this.options, err => {
      if (err) {
        console.log(`Failed to write: ${this.path}`);
      }
    });
  }
}
