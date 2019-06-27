import { SequentialCommand } from "../process/sequential-command";
import { Command } from "../process/command";
import { Project } from "../project/project";
import { Dependency, DependencyType, Paths } from "../app.model";
import { filter, map, take } from "rxjs/operators";
import { ConcurrentCommand } from "../process/concurrent-command";

export class NPM {

  constructor(private paths: Paths, private project: Project) {}

  link(name: string, directory: string) {
    return new SequentialCommand(
      [
        () => this.command(directory, ["npm", "link"]),
        // () => this.command(this.project.directory, ["rm", "-rf", `node_modules/${name}`]),
        () => this.command(this.project.directory, ["npm", "link", name])
      ],
      `${this.project.name}: Link ${name}`
    );
  }

  deploy(dependencies: {[key: string]: string[]}) {
    return new ConcurrentCommand(
      Object.keys(dependencies).filter(directory => dependencies[directory].length).map(
        directory => new SequentialCommand(
          [
            () => this.build(directory, dependencies[directory]),
            () => this.release(directory, dependencies[directory])
          ]
        )
      ),
      `${this.project.name}: Deploy`
    );
  }

  release(directory: string, names: string[]) {
    return this.command(directory, [
        "npm",
        "run",
        "release",
        "--",
        "--skip-git",
        "--canary",
        `dev-zelda-${Date.now()}`,
        "--npm-tag",
        `dev-zelda-${Date.now()}`].concat(...names.map(name => ["--scope", name])),
      `${this.project.name}: Release${names.map(name => ` ${name}`)}`
    );
  }

  build(directory: string, names: string[]) {
    return this.command(
      directory,
      ["npm", "run", "build", "--"].concat(
        ...names.map(name => ["--scope", name])
      ),
      `${this.project.name}: Build${names.map(name => ` ${name}`)}`
    );
  }

  install() {
    return this.command(
      this.project.directory,
      ["npm", "install"],
      `${this.project.name}: Install`
    );
  }

  start(...args: string[]) {
    return this.command(
      this.project.directory,
      ["npm", "start", ...args],
      this.project.name
    );
  }

  private command(cwd: string, segments: string[], name?: string): Command {
    return new Command(
      cwd,
      segments.map(segment => this.paths[segment as keyof Paths] || segment),
      name
    );
  }
}
