import { exists } from "fs";
import { promisify } from "util";

export default promisify(exists);
