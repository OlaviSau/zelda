export function excludeByIndex<T>(collection: T[], indexToExclude: number): T[] {
  return collection.filter((item, index) => index !== indexToExclude);
}
