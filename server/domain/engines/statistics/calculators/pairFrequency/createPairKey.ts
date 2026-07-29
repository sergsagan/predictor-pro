export function createPairKey(first: number, second: number): string {
  const smaller = Math.min(first, second)
  const larger = Math.max(first, second)

  return `${smaller}-${larger}`
}
