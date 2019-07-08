export function exclude<T>(collection: T[], valueToExclude: T): T[] {
  return collection.filter(item => item !== valueToExclude);
}
