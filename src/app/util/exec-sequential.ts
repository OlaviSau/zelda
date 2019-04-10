export function execSequential(...commands: (() => any)[]) {
  if (commands[0]) {
    commands[0]().on("exit", () => execSequential(...commands.slice(1)));
  }
}
