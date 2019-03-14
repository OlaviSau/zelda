export interface Project {
  defaultApplication: string;
  name: string;
  directory: string;
  links: {
    scope: string,
    directory: string,
    name: string
  }[];
}
