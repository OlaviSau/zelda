import { readFile } from "fs";
import { promisify } from "util";

export default promisify(readFile);
