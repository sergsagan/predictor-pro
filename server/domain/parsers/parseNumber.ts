export function parseNumber(value: string): number {
  const number = Number.parseInt(value, 10)

  if (Number.isNaN(number)) {
    throw new Error(`Invalid number: "${value}"`)
  }

  return number
}
