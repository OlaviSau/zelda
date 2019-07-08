export function other<T>(collection: T[], value: T): T | undefined {
  return collection.find(item => item !== value);
}
