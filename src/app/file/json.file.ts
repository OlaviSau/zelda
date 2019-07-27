import { readFile, writeFile } from "fs";

export class JsonFile<T> {
  constructor(private path: string, private options = { encoding: "utf8" }) {}

  static read<T>(path: string, options = { encoding: "utf8" }) {
    return new JsonFile<T>(path, options).read();
  }

  read() {
    return new Promise<T>((resolve) => {
      readFile(this.path, this.options, (err, data) => {
        if (err) {
          console.log(`Failed to read: ${this.path}`);
          return;
        }
        resolve(JSON.parse(data));
      });
    });
  }

  write(value: T) {
    writeFile(this.path, JSON.stringify(value, null, 2), this.options, err => {
      if (err) {
        console.log(`Failed to write: ${this.path}`);
      }
    });
  }
}
