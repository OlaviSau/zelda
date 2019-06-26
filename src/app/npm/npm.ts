import { SequentialCommand } from "../process/sequential-command";
import { Command } from "../process/command";
import { Project } from "../project/project";

export class NPM {

  constructor(private paths, private project: Project) {}

  link(name, directory: string) {
    return new SequentialCommand(
      [
        () => this.command(directory, ["npm", "link"]),
        // () => this.command(this.project.directory, ["rm", "-rf", `node_modules/${name}`]),
        () => this.command(this.project.directory, ["npm", "link", name])
      ],
      `${this.project.name}: Link ${name}`
    );
  }

  deploy() {
    // for (const dependency of this.project.dependencies.filter(({type}) => type === DependencyType.Lerna)) {
    //   this.filterLinkedLernaPackages$(dependency.directory)
    //     .pipe(map(packages => packages.map(p => p.name)))
    //     .subscribe(
    //       names => names.length ? execSequential(
    //         () => this.build(dependency.directory, names),
    //         () => this.release(dependency.directory, names)
    //       ) : null
    //     ).unsubscribe();
    // }
  }

  release(directory, names) {
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

  build(directory, names) {
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

  start(...args) {
    return this.command(
      this.project.directory,
      ["npm", "run", "start", ...args],
      this.project.name
    );
  }

  private command(cwd: string, segments: string[], name?: string): Command {
    return new Command(
      cwd,
      segments.map(segment => this.paths[segment] || segment),
      name
    );
  }
}
