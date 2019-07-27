export default async <T>(
  array: T[],
  filter: (value: T) => Promise<boolean>,
  thisArg?: any
): Promise<T[]> => {
  /* two loops are necessary in order to do the filtering concurrently
   * while keeping the order of the elements
   * (if you find a better way to do it please send a PR!)
   */
  const filteredArray: T[] = [];
  for (const value of array) {
    if (await filter.call(thisArg || this, value)) {
      filteredArray.push(value);
    }
  }
  return filteredArray;
};
