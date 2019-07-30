export function include<T>(collection: T[], value: T, replace?: T): T[] {
  const index = collection.findIndex(item => item === replace);
  if (index !== -1) {
    return  [...collection.slice(0, index), value, ...collection.slice(index + 1)];
  }

  return [...collection, value];
}
