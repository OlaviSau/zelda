export function isArray<T, V>(value: V[] | T): value is (T extends Array<V> ? V : never)[] {
  return Array.isArray(value);
}
