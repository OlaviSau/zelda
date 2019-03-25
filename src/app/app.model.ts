export interface Project {
  defaultApplication: string;
  name: string;
  directory: string;
  dependencies: {
    scope: string,
    directory: string,
    name: string
  }[];
}
