export function move<T>(array: T[], previousIndex: number, currentIndex: number): T[] {
  return previousIndex < currentIndex
    ? [
      ...array.slice(0, previousIndex),
      ...array.slice(previousIndex + 1, currentIndex + 1),
      array[previousIndex],
      ...array.slice(currentIndex + 1)
    ]
    : [
      ...array.slice(0, currentIndex),
      array[previousIndex],
      ...array.slice(currentIndex, previousIndex),
      ...array.slice(previousIndex + 1)
    ];
}
