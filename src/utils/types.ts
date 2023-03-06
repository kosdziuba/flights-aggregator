export interface HashTable<T> {
  [key: string]: T;
}

export function objectMap<T, V>(obj: HashTable<V>, fn: (value: V, key: string, index: number) => T): HashTable<T> {
  return Object.fromEntries(Object.entries(obj).map(([key, value], index) => [key, fn(value, key, index)]));
}
