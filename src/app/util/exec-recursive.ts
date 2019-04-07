import {exec} from "child_process";

export function execRecursive(pid: number, command: string) {
  getChildrenPIDs(pid, childPIDs => {
    for (const childPID of childPIDs ) {
      execRecursive(childPID, command);
    }
  });
  exec(`${command} ${pid}`);
}

function getChildrenPIDs(pid, fn) {
  exec(`wmic process where (ParentProcessId=${pid}) get ProcessId`, (err, data) => fn(parseToPIDs(data)));
}

function parseToPIDs(data) {
  const lines = extractLines(data);
  if (lines) {
    return removeNonDigitLines(lines);
  }
  return -1;
}

function extractLines(data) {
  return data.match(/[^\r\n]+/g);
}

function removeNonDigitLines(lines) {
  return lines.map(line => line.replace( /\D+/g, "")).filter(Boolean);
}
