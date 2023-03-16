export interface HashTable<T> {
  [key: string]: T;
}

export function objectMap<T, V>(obj: HashTable<V>, fn: (value: V, key: string, index: number) => T): HashTable<T> {
  return Object.fromEntries(Object.entries(obj).map(([key, value], index) => [key, fn(value, key, index)]));
}

const dateFormat = /[+-]?\d{4}(-[01]\d(-[0-3]\d(T[0-2]\d:[0-5]\d:?([0-5]\d(\.\d+)?)?[+-][0-2]\d:[0-5]\dZ?)?)?)?/;

function isValidDate(date): boolean {
  return date != null && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date);
}

function dateReviver(key: string, value: unknown): unknown | Date {
  if (
    (key.includes('date') || key.includes('time') || key.includes('Date') || key.includes('Time')) &&
    typeof value === 'string' &&
    dateFormat.test(value)
  ) {
    const potentialDate = new Date(value);
    if (isValidDate(potentialDate)) {
      return potentialDate;
    }
  }
  return value;
}

export function dateTransformer(data: string): object {
  if (data === '' || !data) {
    return JSON.parse('{}');
  } else {
    return JSON.parse(data, dateReviver);
  }
}
