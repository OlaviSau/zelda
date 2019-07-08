export function include<T>(collection: T[], value: T, index?: number): T[] {
  if (typeof index === "undefined" || index === -1) {
    return [...collection, value];
  }

  return [...collection.slice(0, index), value, ...collection.slice(index + 1)];
}
