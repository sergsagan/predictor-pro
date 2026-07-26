export function increaseCounter<K>(
  map: Map<K, number>,
  key: K
): void {
  map.set(key, (map.get(key) ?? 0) + 1)
}
