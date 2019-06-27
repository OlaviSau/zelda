import { PackageDependency } from "./package-dependency";

export type DependencyStrategy = (directory: string) => PackageDependency[];
