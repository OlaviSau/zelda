export function execSequential(...commands: (() => any)[]) {
  if (typeof commands[0] === "function") {
    commands[0]().on("exit", () => execSequential(...commands.slice(1)));
  }
}
