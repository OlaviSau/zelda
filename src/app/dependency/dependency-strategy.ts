import { Dependency } from "../app.model";

export type DependencyStrategy = (dependency: Dependency) => Dependency;
