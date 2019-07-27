export function flatten<T>(array: T[][]): T[] {
  return array.reduce((acc, next) => acc.concat(next), []);
}
